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
 * @interface Visitor
 */
export interface Visitor {
    /**
     * Unique id for the visitor
     * @type {string}
     * @memberof Visitor
     */
    readonly id?: string;
    /**
     * Exhibition id the visitor attended
     * @type {string}
     * @memberof Visitor
     */
    readonly exhibitionId?: string;
    /**
     * 
     * @type {string}
     * @memberof Visitor
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof Visitor
     */
    tagId: string;
    /**
     * 
     * @type {string}
     * @memberof Visitor
     */
    readonly userId?: string;
    /**
     * 
     * @type {string}
     * @memberof Visitor
     */
    readonly creatorId?: string;
    /**
     * 
     * @type {string}
     * @memberof Visitor
     */
    readonly lastModifierId?: string;
    /**
     * Created date
     * @type {Date}
     * @memberof Visitor
     */
    readonly createdAt?: Date;
    /**
     * Date modified
     * @type {Date}
     * @memberof Visitor
     */
    readonly modifiedAt?: Date;
}

export function VisitorFromJSON(json: any): Visitor {
    return VisitorFromJSONTyped(json, false);
}

export function VisitorFromJSONTyped(json: any, ignoreDiscriminator: boolean): Visitor {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'exhibitionId': !exists(json, 'exhibitionId') ? undefined : json['exhibitionId'],
        'email': json['email'],
        'tagId': json['tagId'],
        'userId': !exists(json, 'userId') ? undefined : json['userId'],
        'creatorId': !exists(json, 'creatorId') ? undefined : json['creatorId'],
        'lastModifierId': !exists(json, 'lastModifierId') ? undefined : json['lastModifierId'],
        'createdAt': !exists(json, 'createdAt') ? undefined : (new Date(json['createdAt'])),
        'modifiedAt': !exists(json, 'modifiedAt') ? undefined : (new Date(json['modifiedAt'])),
    };
}

export function VisitorToJSON(value?: Visitor | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'email': value.email,
        'tagId': value.tagId,
    };
}


