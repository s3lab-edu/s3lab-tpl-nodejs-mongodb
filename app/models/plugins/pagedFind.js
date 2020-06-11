/**
 * Created by bioz on 3/15/2017.
 */
'use strict';
const Validator = require('validator');
const Async = require('async');
const Constant = require('../../configs/constant');
const Pieces = require('../../utils/pieces');

module.exports = exports = function pagedFindPlugin (schema) {
    schema.statics.pagedFind = function(options, queryContent, callback) {
        let thisSchema = this;
        let page = 1;

        if( (Pieces.VariableBaseTypeChecking(queryContent['page'], 'string') && Validator.isInt(queryContent['page']))
            || (Pieces.VariableBaseTypeChecking(queryContent['page'], 'number')) ){
            page = queryContent['page'];
        }

        if(page === 0 || page === '0'){
            page = 1;
        }

        let perPage = Constant.DEFAULT_PAGING_SIZE;
        if( (Pieces.VariableBaseTypeChecking(queryContent['perPage'], 'string') && Validator.isInt(queryContent['perPage']))
            || (Pieces.VariableBaseTypeChecking(queryContent['perPage'], 'number')) ){
            perPage = queryContent['perPage'];
        }

        if(!options.itemPerPage){
            options.itemPerPage = parseInt(perPage);
        }
        if(!options.pageIndex){
            options.pageIndex = parseInt(page);
        }

        if( !options.keys ){
            if( !Pieces.VariableBaseTypeChecking(queryContent['fields'], 'string') ){
                options.keys = {'__v': 0};
            }else{
            options.keys = {};
        }
        }
        Pieces.splitAndAssignValueForKey(options.keys, queryContent['fields'], 1);

        options.sort ={};
        Pieces.splitAndAssignValueForSort(options.sort, queryContent['sort']);
        if(!options.sort['updatedAt']){
            options.sort['updatedAt'] = -1;
        }

        let output = {
            data: null,
            pages: {
                current: options.pageIndex,
                prev: 0,
                hasPrev: false,
                next: 0,
                hasNext: false,
                total: 0
            },
            items: {
                begin: ((options.pageIndex * options.itemPerPage) - options.itemPerPage) + 1,
                end: options.pageIndex * options.itemPerPage,
                total: 0
            }
        };

        let countResults = function (callback) {
            thisSchema.count(options.criteria, function (error, count) {
                if(error){
                    return callback(error, null);
                }else{
                    return callback(null, count);
                }
            });
        };

        let getResults = function (callback) {
            let query = thisSchema.find(options.criteria, options.keys);
            query.skip((options.pageIndex - 1) * options.itemPerPage);
            query.limit(options.itemPerPage);
            query.sort(options.sort);

            if(options.populate){
                query.populate(options.populate);
            }

            if(options.populate1){
                query.populate(options.populate1);
            }

            if(options.populate2){
                query.populate(options.populate2);
            }

            query.exec(function (error, results) {
                if(error){
                    return callback(error, null);
                }else{
                    return callback(null, results);
                }
            });
        };

        Async.parallel([
                countResults,
                getResults
            ],
            function (error, results) {
                if (error) {
                    return callback(error, null);
                }

                if(results) {
                    output.items.total = results[0];
                    output.data = results[1];

                //final paging math
                output.pages.total = Math.ceil(output.items.total / options.itemPerPage);
                output.pages.next = ((output.pages.current + 1) > output.pages.total ? 0 : output.pages.current + 1);
                output.pages.hasNext = (output.pages.next !== 0);
                output.pages.prev = output.pages.current - 1;
                output.pages.hasPrev = (output.pages.prev !== 0);
                if (output.items.end > output.items.total) {
                    output.items.end = output.items.total;
                }
                return callback(null, output);
                }else{
                    return callback('data is unavailable', null);
                }
            });
    };
};