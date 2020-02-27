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
/**
 * 
 * @export
 * @interface ExhibitionPageEventSetUserValueData
 */
export interface ExhibitionPageEventSetUserValueData {
    /**
     * 
     * @type {string}
     * @memberof ExhibitionPageEventSetUserValueData
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof ExhibitionPageEventSetUserValueData
     */
    value?: string;
}

export function ExhibitionPageEventSetUserValueDataFromJSON(json: any): ExhibitionPageEventSetUserValueData {
    return ExhibitionPageEventSetUserValueDataFromJSONTyped(json, false);
}

export function ExhibitionPageEventSetUserValueDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExhibitionPageEventSetUserValueData {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        'value': !exists(json, 'value') ? undefined : json['value'],
    };
}

export function ExhibitionPageEventSetUserValueDataToJSON(value?: ExhibitionPageEventSetUserValueData | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'value': value.value,
    };
}


