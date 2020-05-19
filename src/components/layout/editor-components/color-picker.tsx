import * as React from "react";
import { PageLayoutViewProperty } from "../../../generated/client";
import { WithStyles, withStyles, TextField } from "@material-ui/core";
import styles from "../../../styles/color-picker";
import { SketchPicker, ColorResult } from 'react-color';
import theme from "../../../styles/theme";

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
  property: PageLayoutViewProperty;

  /**
   * On color change handler
   * @param propertyToUpdate page layout view property to update
   */
  onColorChange: (propertyToUpdate: PageLayoutViewProperty) => void;
}

/**
 * Interface representing component state
 */
interface State {
  showColorPicker: boolean;
}

/**
 * Component for add generic layout property select
 */
class GenericPropertySelect extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      showColorPicker: false
    };
  }

  /**
   * Component render method
   */
  public render() {
    const { classes, property } = this.props;
    const { showColorPicker } = this.state;
    return (
      <div style={{ display: "flex", alignItems: "center", marginTop: theme.spacing(2) }}>
        <div className={ classes.color } style={{ backgroundColor: property.value }} onClick={ this.onColorBoxClick }></div>
        { showColorPicker &&
          <SketchPicker
            color={ property.value }
            onChangeComplete={ this.handleChangeComplete }
          />
        }
        <TextField disabled style={{ marginLeft: theme.spacing(2) }} variant="outlined" value={ property.value }/>
      </div>
    );
  }

  /**
   * On color change complete handler
   * @param color selected color
   */
  private handleChangeComplete = (color: ColorResult) => {
    const { onColorChange, property } = this.props;
    const propertyToUpdate = property;
    property.value = color.hex;
    onColorChange(propertyToUpdate);
  };

  /**
   * On color box click handler
   */
  private onColorBoxClick = () => {
    this.setState({
      showColorPicker: !this.state.showColorPicker
    });
  }

}

export default (withStyles(styles)(GenericPropertySelect));