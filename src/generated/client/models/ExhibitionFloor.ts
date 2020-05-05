/* tslint:disable */
/* eslint-disable */
/**
 * Muisti API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    Bounds,
    BoundsFromJSON,
    BoundsFromJSONTyped,
    BoundsToJSON,
} from './';

/**
 * 
 * @export
 * @interface ExhibitionFloor
 */
export interface ExhibitionFloor {
    /**
     * 
     * @type {string}
     * @memberof ExhibitionFloor
     */
    readonly id?: string;
    /**
     * 
     * @type {string}
     * @memberof ExhibitionFloor
     */
    readonly exhibitionId?: string;
    /**
     * 
     * @type {string}
     * @memberof ExhibitionFloor
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof ExhibitionFloor
     */
    floorPlanUrl?: string;
    /**
     * 
     * @type {Bounds}
     * @memberof ExhibitionFloor
     */
    floorPlanBounds?: Bounds;
    /**
     * 
     * @type {string}
     * @memberof ExhibitionFloor
     */
    readonly creatorId?: string;
    /**
     * 
     * @type {string}
     * @memberof ExhibitionFloor
     */
    readonly lastModifierId?: string;
    /**
     * Created date
     * @type {Date}
     * @memberof ExhibitionFloor
     */
    readonly createdAt?: Date;
    /**
     * Date modified
     * @type {Date}
     * @memberof ExhibitionFloor
     */
    readonly modifiedAt?: Date;
}

export function ExhibitionFloorFromJSON(json: any): ExhibitionFloor {
    return ExhibitionFloorFromJSONTyped(json, false);
}

export function ExhibitionFloorFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExhibitionFloor {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'exhibitionId': !exists(json, 'exhibitionId') ? undefined : json['exhibitionId'],
        'name': json['name'],
        'floorPlanUrl': !exists(json, 'floorPlanUrl') ? undefined : json['floorPlanUrl'],
        'floorPlanBounds': !exists(json, 'floorPlanBounds') ? undefined : BoundsFromJSON(json['floorPlanBounds']),
        'creatorId': !exists(json, 'creatorId') ? undefined : json['creatorId'],
        'lastModifierId': !exists(json, 'lastModifierId') ? undefined : json['lastModifierId'],
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'modifiedAt': !exists(json, 'modifiedAt') ? undefined : (new Date(json['modifiedAt'])),
    };
}

export function ExhibitionFloorToJSON(value?: ExhibitionFloor | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'floorPlanUrl': value.floorPlanUrl,
        'floorPlanBounds': BoundsToJSON(value.floorPlanBounds),
    };
}


