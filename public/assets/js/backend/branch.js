define(['jquery', 'backend', 'table', 'form','template','angular','cosmetic'], function ($, Backend, Table, Form, Template,angular, Cosmetic) {
    var Controller = {

        lands:{
            index:function($scope, $compile,$timeout, data) {
            }
        },
        indexscape:function($scope, $compile,$timeout){
            var options = {
                extend: {
                    index_url: 'branch/index',
                    add_url: 'branch/add',
                    del_url: 'branch/del',
                    multi_url: 'branch/multi',
                    summation_url: 'branch/summation',
                    table: 'branch',
                },
                buttons : [
                    {
                        name: 'view',
                        title: function(row, j){
                            return __('%s', row.name);
                        },
                        classname: 'btn btn-xs  btn-success btn-magic btn-addtabs btn-view',
                        icon: 'fa fa-folder-o',
                        url: 'branch/view'
                    }
                ]
            };
            Table.api.init(options);
            Form.api.bindevent($("div[ng-controller='index']"));
        },

        scenery: {
            account: function($scope, $compile,$timeout, data){
                $scope.reckonIds = [];

                $scope.chequeChanged = function(data) {
                    var reckonIds = [];
                    angular.forEach(data.selected, function(id){
                        if ($.isNumeric(id))
                            reckonIds.push(id);
                    });
                    $scope.reckonIds = reckonIds;
                    $scope.$broadcast("refurbish");
                };

                $scope.searchFieldsParams = function(param) {
                    param.custom = {
                        "reckon_type":"branch",
                        "reckon_model_id":$scope.row.id,
                    };

                    if ($scope.reckonIds.length > 0) {
                        param.custom['cheque_model_id'] = ["in",$scope.reckonIds];
                    }
                    return param;
                };

                Table.api.init({
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __('%s', row.name);
                            },
                            classname: 'btn btn-xs btn-success btn-magic btn-dialog btn-view',
                            icon: 'fa fa-folder-o',
                            url: 'account/view'
                        }
                    ]
                });
                $scope.fields = data.fields;
                angular.element("#tab-" +$scope.scenery.name).html($compile(data.content)($scope));
                $scope.$broadcast("shownTable");


                var refresh = function(){
                    $scope.refreshRow();
                };
                $(".btn-add-account").data("callback", refresh);$(".btn-refresh").click(refresh)
            },
            according :function($scope, $compile,$timeout, data){
                $scope.staffChange = function(ids){
                    selected = ids;
                    $('#calendar').fullCalendar('refetchEvents');
                };
                angular.element("#tab-" +$scope.scenery.name).html($compile(data.content)($scope));

                var selected = [];
                require(['jquery-ui.min', 'fullcalendar', 'fullcalendar-lang'], function () {
                    var events = {
                        url: "calendar/index",
                        data: function () {
                            var staffIds = [];
                            if (selected.length > 0) {
                                $.each(selected, function(i, v){
                                    staffIds.push(v.data.id);
                                });
                            }
                            return staffIds.length > 0 ? {'staff_id': staffIds}:{'branch_id':[$scope.row.id]};
                        }
                    };
                    $('#calendar').fullCalendar({
                        header: {
                            left: 'prev,next today',
                            center: 'title',
                            right: 'month,agendaWeek,agendaDay, listMonth'
                        },
                        navLinks: true, // can click day/week names to navigate views
                        events: events,
                        eventAfterAllRender: function (view) {
                            $("a.fc-event[href]").attr("target", "_blank");
                        },
                        eventClick: function (calEvent, jsEvent, view) {
                            var that = this;
                            var status = $(this).hasClass("fc-completed") ? "normal" : "completed";

                        },
                        dayClick: function (date, jsEvent, view) {
                        },
                    });


                });
                Form.api.bindevent($("form[role=form]"));

                $scope.$broadcast("shownTable");
            },
            provider: function($scope, $compile,$timeout, data){
                $scope.varietyModelIds = [];
                $scope.classChanged = function(data) {
                    var typeIds = [];
                    angular.forEach(data.selected, function(id){
                        if ($.isNumeric(id))
                            typeIds.push(id);
                    });
                    $scope.varietyModelIds = typeIds;
                    $scope.$broadcast("refurbish");
                };

                $scope.searchFieldsParams = function(param) {
                    param.custom = {
                        "provider.branch_model_id":$scope.row.id,
                    };
                    if ($scope.varietyModelIds.length > 0) {
                        param.custom['variety_model_id'] = ["in",$scope.varietyModelIds];
                    }
                    return param;
                };

                Table.api.init({
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __(' %s', row.id);
                            },
                            classname: 'btn btn-xs btn-success btn-magic btn-dialog btn-view',
                            icon: 'fa fa-folder-o',
                            url: 'provider/hinder'
                        }
                    ]
                });
                $scope.fields = data.fields;
                angular.element("#tab-" +$scope.scenery.name).html($compile(data.content)($scope));
                $scope.$broadcast("shownTable");
            },
            staff: function($scope, $compile,$timeout, data){
                $scope.searchFieldsParams = function(param) {
                    param.custom = {
                        "branch_model_id":$scope.row.id,
                    };
                    return param;
                };

                Table.api.init({
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __(' %s', row.id);
                            },
                            classname: 'btn btn-xs btn-success btn-magic btn-dialog btn-view',
                            icon: 'fa fa-folder-o',
                            url: 'staff/hinder'
                        }
                    ]
                });
                $scope.fields = data.fields;
                angular.element("#tab-" +$scope.scenery.name).html($compile(data.content)($scope));
                $scope.$broadcast("shownTable");
            },
            mailing: function($scope, $compile,$timeout, data){
                $scope.searchFieldsParams = function(param) {
                    param.custom = {
                        "branch_model_id":$scope.row.id,
                    };
                    return param;
                };

                Table.api.init({
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __(' %s', row.id);
                            },
                            classname: 'btn btn-xs btn-success btn-magic btn-dialog btn-view',
                            icon: 'fa fa-folder-o',
                            url: 'mailing/hinder'
                        }
                    ]
                });
                $scope.fields = data.fields;
                angular.element("#tab-" +$scope.scenery.name).html($compile(data.content)($scope));
                $scope.$broadcast("shownTable");
            },
            distribute: function($scope, $compile,$timeout, data){
                $scope.searchFieldsParams = function(param) {
                    param.branch_model_id = $scope.row.id;
                    param.custom = {
                    };
                    return param;
                };

                Table.api.init({
                    buttons : [
                        {
                            name: 'view',
                            title: function(row, j){
                                return __(' %s', row.id);
                            },
                            classname: 'btn btn-xs btn-success btn-magic btn-dialog btn-view',
                            icon: 'fa fa-folder-o',
                            url: function(row){
                                return "/promotion/hinder?id=" + row.promotion_model_id;
                            }
                        }
                    ]
                });
                $scope.fields = data.fields;
                angular.element("#tab-" +$scope.scenery.name).html($compile(data.content)($scope));
                $scope.$broadcast("shownTable");
            },
        },
        viewscape:function($scope, $compile,$parse, $timeout){
            $scope.refreshRow = function(){
                $.ajax({url: "branch/index",dataType: 'json',
                    data:{
                        custom:{id:$scope.row.id}
                    },
                    success: function (data) {
                        if (data && data.rows && data.rows.length == 1) {
                            $scope.$apply(function(){
                                $parse("row").assign($scope, data.rows[0]);
                            });
                        }
                    }
                });
            };
        },
        select:function(){
            Form.api.bindevent($("[role='form']"));
        },
        chart:function() {
            AngularApp.controller("chart", function($scope,$sce, $compile,$timeout) {
                $scope.stat = {};
                $scope.refresh = function(){
                    $.ajax({url: "branch/statistic",dataType: 'json',cache: false,
                        success: function (ret) {
                            $scope.$apply(function(){
                                $scope.stat = ret.data;
                            });
                        }
                    });
                };
                $scope.$on("refurbish", $scope.refresh);$scope.refresh(); $(".btn-refresh").on("click", $scope.refresh);
            });
        },
        api: {
        }
    };
    Controller.api = $.extend(Cosmetic.api, Controller.api);
    return $.extend(Cosmetic, Controller);
});