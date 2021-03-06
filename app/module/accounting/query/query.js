/**
 * 凭证录入
 * 
 *@author  chenyong5 at 2016-12-27  build.
 * @version $Id$
 */

var app = require('app/app.js');
require('/mix/directive/miDatepicker/miDatepicker.js');
require('/mix/directive/miSelect/miSelect.js');
var $ = angular.element = require('/app/directive/miBsTable/miBsTable.js');


app.registerController('queryCtrl', ['$rootScope', '$scope', '$http', '$stateParams', 'dateFilter',
    function($rootScope, $scope, $http, $stateParams, dateFilter) {

	$scope.title = "登账/凭证查询";
	$scope.queryParams = {
        startDate: dateFilter($rootScope.startTime, 'yyyy-MM-dd'),
        endDate: dateFilter($rootScope.endTime, 'yyyy-MM-dd')
    };
    angular.forEach($stateParams, function(value, index) {
        if(value) {
            $scope.queryParams[index] = value;
        }
    });

    $scope.miBsTable = {
        options: {},
        state: {}
    }


    function resetInfo(data){
    	var html = "";
    	if(data.accountName){
    		html += data.accountName + "</br>";
    	}
    	if(data.accountNo){
    		html += data.accountNo + "</br>";
    	}
    	if(data.fee){
    		html += data.fee + "</br>";
    	}
    	if(data.subject){
    		html += data.subject;
    	}
    	if(data.name){
    		html += data.name + "</br>";
    	}
    	if(data.applicationTime){
    		html += data.applicationTime + "</br>";
    	}
    	return html;
    }

    $http.get('/accounting/voucher/conditions')
    	.success(function(data){
    		var data = data.data.checkStatus;
    		$scope.statusOptions = data;
    	});


	$http.get('/accounting/voucher/query', {
    	params: $scope.queryParams
    })
    .success(function(data, status, headers, config) {

        $scope.miBsTable = {
            options: {
                    data: data.data,
                    toggle: 'table',
                    rowStyle: function (row, index) {
                        return { classes: 'none' };
                    },
                    cache: false,
                    //height: 400,
                    striped: true,
                    pagination: false,
                    pageSize: 25,
                    pageList: [5, 10, 25, 50, 100, 200],
                    search: true,
                    showColumns: true,
                    showRefresh: false,
                    showExport: true,
                    exportDataType: 'all',
                    minimumCountColumns: 2,
                    clickToSelect: false,
                    showToggle: true,
                    maintainSelected: true,
                    columns: [{
                        field: 'importDate',
                        title: '录入日期',
                        width: 80
                    }, {
                        field: 'accountingVoucherNo',
                        title: '会计凭证号',
                        width: 150
                    }, {
                        field: 'debitInfo',
                        title: '借方信息',
                        align: 'left',
                        valign: 'center',
                        formatter: resetInfo,
                        width: 200
                    }, {
                        field: 'creditInfo',
                        title: '贷方信息',
                        align: 'left',
                        valign: 'top',
                        formatter: resetInfo,
                        width: 200
                    }, {
                        field: 'comments',
                        title: '备注',
                        align: 'left',
                        valign: 'top',
                        width: 150
                    }, {
                        field: 'applicant',
                        title: '申请人',
                        align: 'left',
                        valign: 'top',
                        formatter: resetInfo,
                        width: 120
                    }, {
                        field: 'checker',
                        title: '复核人',
                        align: 'left',
                        valign: 'top',
                        formatter: resetInfo,
                        width: 120
                    }, {
                        field: 'checkStatus',
                        title: '状态',
                        align: 'left',
                        valign: 'top',
                        width: 100
                    }]
                }
        }
    });

     //查询
    $scope.search = function() {
    	console.log(JSON.stringify($scope.queryParams));
    	return;
        $state.go('accounting.voucher', $scope.queryParams, {
            reload: true
        });
    }
}]);