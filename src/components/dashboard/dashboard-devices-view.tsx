import * as React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ReduxState, ReduxActions } from "../../store";
import { setSelectedExhibition } from "../../actions/exhibitions";

// eslint-disable-next-line max-len
import { ListItemSecondaryAction, TextField, Switch, Button, WithStyles, withStyles, Typography, Select, MenuItem, Grid, Divider, ListItemAvatar, ListItem, Avatar, List, ListItemText, CircularProgress, IconButton, Dialog } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';

import styles from "../../styles/dashboard-component-styles";
import { History } from "history";
import { KeycloakInstance } from "keycloak-js";
import { AccessToken } from "../../types";
import { Exhibition, DeviceModel, DeviceModelCapabilities, DeviceModelDisplayMetrics, DeviceModelDimensions } from "../../generated/client";
import strings from "../../localization/strings";
import DashboardLayout from "./dashboard-layout";
import moment from "moment";
import defaultExhibitionImage from "../../resources/gfx/muisti-logo.png";
import Api from "../../api/api";

import ArrowDownIcon from "../../resources/gfx/svg-paths/nuoli-alas";
import EditorDialog from '../generic/editor-dialog';
import SearchIcon from "../../resources/gfx/svg-paths/hae";
import theme from "../../styles/theme";
import ConfirmDialog from "../generic/confirm-dialog";


/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
  history: History;
  keycloak: KeycloakInstance;
  accessToken: AccessToken;
  setSelectedExhibition: typeof setSelectedExhibition;
}

/**
 * Interface representing component state
 */
interface State {
  error?: string | Error;
  devices: DeviceModel[];
  loading: boolean;
  deviceSettingsPanelOpen: boolean;
  newDevice: boolean;
  selectedDevice?: DeviceModel;
  addDeviceDialogOpen: boolean;
  deleteDialogOpen: boolean;
}

/**
 * Component for dashboard devices view
 */
class DashboardDevicesView extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      devices: [],
      newDevice: false,
      deviceSettingsPanelOpen: false,
      addDeviceDialogOpen: false,
      deleteDialogOpen: false
    };
  }

  /**
   * Component did mount life-cycle handler
   */
  public componentDidMount = async () => {
    this.setState({
      loading: true
    });

    try {
      const { accessToken } = this.props;

      const exhibitionDeviceModelsApi = Api.getDeviceModelsApi(accessToken);
      const devices = await exhibitionDeviceModelsApi.listDeviceModels();

      this.setState({ devices });
    } catch (error) {
      this.setState({ error });
    }

    this.setState({
      loading: false
    });
  }

  /**
   * Component render method
   */
  public render() {
    const { classes, history } = this.props;

    const filterOptions = [
      { name: strings.filtering.dashboard.devices.all , value: "ALL" }
    ];

    const devices = this.state.devices && this.state.devices.map(device => this.renderDeviceListItem(device));
    if (this.state.loading) {
      return (
        <DashboardLayout history={ history }>
          <CircularProgress />
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout history={ history }>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid container key="title" justify="space-between" direction="row" alignItems="center" >
              <Typography variant="h2" component="span">
                { strings.dashboard.devices.title }
              </Typography>
              <Button 
                disableElevation
                variant="contained"
                className={ classes.actionBtn }
                onClick={ () => this.onAddDeviceClick() }
                >
                { strings.dashboard.devices.newDevice }
              </Button>
            </Grid>
            <Grid container key="search" justify="space-between" alignItems="center" direction="row" style={{ marginTop: theme.spacing(4) }} >
              <Grid item>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <SearchIcon fontSize="small" color="primary" style={{ marginRight: theme.spacing(1) }} />
                  <TextField id="search-input" label="Hae..." />
                </div>
              </Grid>
                <Grid item key="list-functions">
                  <Select
                    IconComponent={ props => (
                      <ArrowDownIcon { ...props } className={`material-icons ${ props.className }`}/>
                    )}
                    id="select-filtering" 
                    defaultValue="ALL"
                  >
                  { filterOptions.map(option =>
                    <MenuItem value={ option.value } key={ option.value }>{ option.name }</MenuItem>
                  )}
                </Select>
              </Grid>
            </Grid>
          </Grid>
        <Divider />
        <div className={ classes.content }>
          <List>
            { devices &&
              devices
            }
          </List>
        </div>
        { this.renderModifyDeviceDialog() }
        {/* { this.renderConfirmDeleteDialog() } */}
    </DashboardLayout>
    );
  }

  /**
   * Renders device list item
   */
  private renderDeviceListItem = (device: DeviceModel) => {
    const { classes } = this.props;
    const deviceId = device.id;
    if (!deviceId) {
      return;
    }

    return (
      <ListItem button onClick={ () => this.onDeviceClick( device ) } >
        <ListItemAvatar className={ classes.muistiAvatar }>
          <Avatar src={ defaultExhibitionImage } />
        </ListItemAvatar>
        <ListItemText primary={ device.model } secondary={ `${ strings.dashboard.recent.lastModified } ${ moment(device.modifiedAt).fromNow() }` } />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete" onClick={ () => this.setState({ deleteDialogOpen: true }) }>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  /**
   * Render device delete confirmation dialog
   */
  private renderConfirmDeleteDialog = ( device: DeviceModel ) => {
    return (
      <ConfirmDialog
        open={ this.state.deleteDialogOpen }
        title="Poista laite?"
        text="Haluatko varmasti poistaa laitteen? Tätä toimintoa ei voi peruuttaa"
        onClose={() => {}} 
        onCancel={() => this.setState({ deleteDialogOpen: false })}
        onConfirm={() => this.onDeleteDeviceClick( device )}
        positiveButtonText="Poista"
        cancelButtonText="Peruuta"
      /> 
    )
  }


  /**
   * Render device settings view
   */
  private renderModifyDeviceDialog = () => {

    const { selectedDevice, newDevice, addDeviceDialogOpen } = this.state;

    return (
      <EditorDialog
        open={ addDeviceDialogOpen }
        title={ newDevice ? "Uusi laite" : selectedDevice ? `Muokkaa laitetta - ${selectedDevice.model}` : "Muokkaa laitetta" }
        onClose={() => {}}  
        onCancel={() => this.setState({ addDeviceDialogOpen:false })}
        onConfirm={() => this.onSaveDeviceClick()}
        positiveButtonText="Tallenna"
        cancelButtonText="Peruuta"
      >
        <h5>{ strings.dashboard.devices.dialog.touchScreen }</h5>
        <Switch
          checked={ selectedDevice?.capabilities.touch }
          onChange={ (event: React.ChangeEvent<HTMLInputElement>) => this.onDeviceInfoChange(event, selectedDevice?.capabilities.touch) }
          color="primary"
          name="capabilities.touch"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />

        <h4>{ strings.dashboard.devices.dialog.dimensions.physicalSize }</h4>
        <TextField
          type="width"
          label={ strings.dashboard.devices.dialog.dimensions.width }
          variant="outlined"
          name="dimensions.width"
          value={ selectedDevice ? selectedDevice.dimensions.width : "" }
          onChange={ (event: React.ChangeEvent<HTMLInputElement>) => this.onDeviceInfoChange(event) }
        /> 

        <TextField
          type="height"
          label={ strings.dashboard.devices.dialog.dimensions.height }
          variant="outlined"
          name="dimensions.height"
          value={ selectedDevice ? selectedDevice.dimensions.height : "" }
          onChange={ (event: React.ChangeEvent<HTMLInputElement>) => this.onDeviceInfoChange(event) }
        /> 
        
        <h4>{ strings.dashboard.devices.dialog.displayMetrics.displayInfo }</h4>
        { this.renderDisplayMetricOptions() }
        <h4>{ strings.dashboard.devices.dialog.brand }</h4>
        <TextField
          type="manufacturer"
          label={ strings.dashboard.devices.dialog.brand }
          variant="outlined"
          name="manufacturer"
          value={ selectedDevice ? selectedDevice.manufacturer : "" }
          onChange={ (event: React.ChangeEvent<HTMLInputElement>) => this.onDeviceInfoChange(event) }
        /> 
        <h4>{ strings.dashboard.devices.dialog.model }</h4>
        <TextField
          type="model"
          label={ strings.dashboard.devices.dialog.model }
          variant="outlined"
          name="model"
          value={ selectedDevice ? selectedDevice.model : "" }
          onChange={ (event: React.ChangeEvent<HTMLInputElement>) => this.onDeviceInfoChange(event) }
        />
      </EditorDialog>
    );
  }

  /**
   * Render display metric options
   */
  private renderDisplayMetricOptions = () => {
    const { selectedDevice } = this.state;

    return <>
      <TextField
        type="density"
        label={ strings.dashboard.devices.dialog.displayMetrics.resolution }
        variant="outlined"
        value={ selectedDevice ? selectedDevice.displayMetrics.density : "" }
        name="displayMetrics.density"
        onChange={ (event: React.ChangeEvent<HTMLInputElement>) => this.onDeviceInfoChange(event) }
      /> 

      <TextField
        type="heightPixels"
        label={ strings.dashboard.devices.dialog.displayMetrics.displayHeight }
        variant="outlined"
        value={ selectedDevice ? selectedDevice.displayMetrics.heightPixels : "" }
        name="displayMetrics.heightPixels"
        onChange={ (event: React.ChangeEvent<HTMLInputElement>) => this.onDeviceInfoChange(event) }
      />

      <TextField
        type="widthPixels"
        label={ strings.dashboard.devices.dialog.displayMetrics.displayWidth }
        variant="outlined"
        value={ selectedDevice ? selectedDevice.displayMetrics.widthPixels : "" }
        name="displayMetrics.widthPixels"
        onChange={ (event: React.ChangeEvent<HTMLInputElement>) => this.onDeviceInfoChange(event) }
      /> 

      <TextField
        type="xdpi"
        label={ strings.dashboard.devices.dialog.displayMetrics.displayXDpi }
        variant="outlined"
        value={ selectedDevice ? selectedDevice.displayMetrics.xdpi : "" }
        name="displayMetrics.xdpi"
        onChange={ (event: React.ChangeEvent<HTMLInputElement>) => this.onDeviceInfoChange(event) }
      />

      <TextField
        type="ydpi"
        label={ strings.dashboard.devices.dialog.displayMetrics.displayYDpi } variant="outlined"
        value={ selectedDevice ? selectedDevice.displayMetrics.ydpi : "" }
        name="displayMetrics.ydpi"
        onChange={ (event: React.ChangeEvent<HTMLInputElement>) => this.onDeviceInfoChange(event) }
      /> 
    </>
  }

  /**
   * Device info change handler
   * @param event React changeevent
   * @param checkboxValue checkbox value 
   */
  private onDeviceInfoChange = async (event: React.ChangeEvent<HTMLInputElement>, checkboxValue?: boolean) => {
    const { name, value } = event.target;

    const variable = name.split(".");
    let deviceToUpdate;

    if (variable.length > 1) {
      /**
       * As a fast work around will use type any.
       */
      const key1 = variable[0] as any;
      const key2 = variable[1] as any;

      deviceToUpdate = { ...this.state.selectedDevice } as DeviceModel;

      if (hasKey(deviceToUpdate, key1)) {
        let variableToUpdate;
        if (key1 === "dimensions") {
          variableToUpdate = deviceToUpdate[key1] as DeviceModelDimensions;
  
          if (hasKey(variableToUpdate, key2)) {
            variableToUpdate[key2] = Number(value);
          }
          deviceToUpdate[key1] = variableToUpdate;
        }

        if (key1 === "displayMetrics") {
          variableToUpdate = deviceToUpdate[key1] as DeviceModelDisplayMetrics;
  
          if (hasKey(variableToUpdate, key2)) {
            variableToUpdate[key2] = Number(value);
          }
  
          deviceToUpdate[key1] = variableToUpdate;
        }

        if (key1 === "capabilities") {
          variableToUpdate = deviceToUpdate[key1] as DeviceModelCapabilities;
  
          if (hasKey(variableToUpdate, key2)) {
            variableToUpdate[key2] = !checkboxValue;
          }
  
          deviceToUpdate[key1] = variableToUpdate;
        }
      }
    } else {
      deviceToUpdate = { ...this.state.selectedDevice, [name]: value } as DeviceModel; 
    }

    this.setState({
      selectedDevice : deviceToUpdate
    });
  }

  /**
   * On device click handler
   * @param device selected device
   */
  private onDeviceClick = async (device: DeviceModel) => {
    this.setState({
      addDeviceDialogOpen: true,
      newDevice: false,
      selectedDevice: device
    });
  }

  /**
   * Delete device click handler
   * @param deviceToDelete device to delete
   */
  private onDeleteDeviceClick = async (deviceToDelete: DeviceModel) => {
    const { accessToken } = this.props;
 
    if (deviceToDelete) {
      const deviceModelsApi = Api.getDeviceModelsApi(accessToken);

      await deviceModelsApi.deleteDeviceModel({
        deviceModelId: deviceToDelete.id!
      });

      const devices = [...this.state.devices];
      const index = devices.findIndex(device => deviceToDelete.id === device.id);

      if (index > -1) {
        devices.splice(index, 1);

        this.setState({
          devices: devices,
          selectedDevice: undefined,
          deleteDialogOpen: false
        });
      }
    }
  }

  /**
   * On save device click handler
   */
  private onSaveDeviceClick = async () => {
    const { newDevice } = this.state;

    if (newDevice) {
      this.createNewDevice();
    } 
    else {
      this.updateDevice();
    }
  }

  /**
   * Create new device with default values handler
   */
  private createNewDevice = async () => {
    const { accessToken } = this.props;
    const { selectedDevice } = this.state;
 
    if (selectedDevice) {
      const deviceModelsApi = Api.getDeviceModelsApi(accessToken);

      const createdDevice = await deviceModelsApi.createDeviceModel({
        deviceModel: selectedDevice
      });
  
      this.setState({
        devices: [...this.state.devices, createdDevice],
        selectedDevice: createdDevice,
        deviceSettingsPanelOpen: false
      });
    }
  }

  /**
   * Update device handler
   */
  private updateDevice = async () => {
    const { accessToken } = this.props;
    const { selectedDevice } = this.state;
 
    if (selectedDevice) {
      const deviceModelsApi = Api.getDeviceModelsApi(accessToken);
    
      const updatedDevice = await deviceModelsApi.updateDeviceModel({
        deviceModel: selectedDevice,
        deviceModelId: selectedDevice.id!
      });

      const devices = [...this.state.devices];
      const index = devices.findIndex(device => updatedDevice.id === device.id);

      if (index > -1) {
        devices.splice(index, 1);

        this.setState({
          devices: [...devices, updatedDevice],
          selectedDevice: updatedDevice,
          deviceSettingsPanelOpen: false
        });
      }
    }
  }

  /**
   * Add new device to state handler. Note: this just creates new device to state.
   * Saving to API is done in createNewDevice
   */
  private onAddDeviceClick = () => {

    const newDeviceCapabilities: DeviceModelCapabilities = {
      touch: true
    };

    const newDeviceDimensions: DeviceModelDimensions = {
      width: 100,
      height: 100
    };

    const newDeviceDisplayMetrics: DeviceModelDisplayMetrics = {
      density: 100,
      heightPixels: 100,
      widthPixels: 100,
      xdpi: 100,
      ydpi: 100
    };

    const newDeviceModel: DeviceModel = {
      capabilities: newDeviceCapabilities,
      dimensions: newDeviceDimensions,
      displayMetrics: newDeviceDisplayMetrics,
      manufacturer: "Company",
      model: "Model"
    };

    this.setState({
      addDeviceDialogOpen: true,
      deviceSettingsPanelOpen: true,
      newDevice: true,
      selectedDevice: newDeviceModel,
    });
  }
}

/**
 * Check if given key can be found from the given object.
 * This is needed for updating nested objects in state
 * @param obj object to check from
 * @param key key to check from object
 */
function hasKey<T>(obj: T, key: keyof T): key is keyof T {
  return key in obj;
}

/**
 * Redux mapper for mapping store state to component props
 *
 * @param state store state
 */
function mapStateToProps(state: ReduxState) {
  return {
    keycloak: state.auth.keycloak as KeycloakInstance,
    accessToken: state.auth.accessToken as AccessToken,
    exhibitions: state.exhibitions.exhibitions
  };
}

/**
 * Redux mapper for mapping component dispatches
 *
 * @param dispatch dispatch method
 */
function mapDispatchToProps(dispatch: Dispatch<ReduxActions>) {
  return {
    setSelectedExhibition: (exhibition: Exhibition) => dispatch(setSelectedExhibition(exhibition))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DashboardDevicesView));
