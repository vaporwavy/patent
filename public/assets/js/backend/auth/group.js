define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'jstree'], function ($, undefined, Backend, Table, Form, undefined) {
    //读取选中的条目
    $.jstree.core.prototype.get_all_checked = function (full) {
        var obj = this.get_selected(), i, j;
        for (i = 0, j = obj.length; i < j; i++) {
            obj = obj.concat(this.get_node(obj[i]).parents);
        }
        obj = $.grep(obj, function (v, i, a) {
            return v != '#';
        });
        obj = obj.filter(function (itm, i, a) {
            return i == a.indexOf(itm);
        });
        return full ? $.map(obj, $.proxy(function (i) {
            return this.get_node(i);
        }, this)) : obj;
    };
    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    "index_url": "auth/group/index",
                    "add_url": "auth/group/add",
                    "edit_url": "auth/group/edit",
                    "del_url": "auth/group/del",
                    "multi_url": "auth/group/multi",
                }
            });

            var table = $("#table");

            //在表格内容渲染完成后回调的事件
            table.on('post-body.bs.table', function (e, json) {
                $("tbody tr[data-index]", this).each(function () {
                    if (Config.admin.group_ids.indexOf(parseInt(parseInt($("td:eq(1)", this).text()))) > -1) {
                        $("input[type=checkbox]", this).prop("disabled", true);
                    }
                });
            });
            Form.events.selectpicker($("#toolbar"));

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                escape: false,
                columns: [
                    [
                        {field: 'state', checkbox: true, },
                        {field: 'name', title: __('Name'), align: 'left'},
                        {
                            field: 'department.name',
                            title: __('Department'),
                            align: 'left'
                        },
                        {field: 'status', title: __('Status'), formatter: Table.api.formatter.status},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: function (value, row, index) {
                                if (Config.admin.group_ids.indexOf(parseInt(row.id)) > -1) {
                                    return '';
                                }
                                return Table.api.formatter.operate.call(this, value, row, index);
                            }}
                    ]
                ],
                pagination: false,
                search: false,
                commonSearch: false,
                queryParams: function (params) {
                    return params;
                }

            });

            // 为表格绑定事件
            Table.api.bindevent(table);//当内容渲染完成后

            $(".btn-add-group").on("click", function(){
                var branch_id = $('[name="branch_id"]').val();
                var url = "auth/group/add/branch_id/" + branch_id;
                Backend.api.open(url, "新部门", {
                    callback: function (res) {
                        table.bootstrapTable('refresh');
                    }}
                );
            });

        },

        refeshQuarters:function(branch_id){
            var url = "auth/group/groupdata";
            $.ajax({
                type : 'get',
                dataType : 'json',
                url : url,
                data:{
                    branch_id:branch_id
                },
                success : function(datas) {
                    var groupInput = $("select[name='row[quarters][]']");
                    $("option", groupInput).remove();

                    $.each(datas.data, function(k,v){
                        var opt = $("<option>");
                        opt.val(k).html(v);
                        groupInput.append(opt);
                    });
                    groupInput.selectpicker('refresh');
                }
            });
        },
        select: function () {
            $('[name="row[branch_model_id]"]').data("e-selected", function(data){
                Controller.refeshQuarters(data.id);
            });

            Form.api.bindevent($("form[role=form]"), function(data, ret){
                Backend.api.close(ret);
            });

            var branch_model_id = Fast.api.query("branch_model_id");
            if (Config.staff) {
                branch_model_id = Config.staff.branch_model_id;;
            }

            if (branch_model_id) {
                $('#form-branch_model_id').val(branch_model_id).hide().trigger("rate");
                window.setTimeout(function(){Controller.refeshQuarters(branch_model_id);}, 200);
            }

            $("#submit").on("click", function(){
                var rows = $("select[name='row[quarters][]']").selectpicker('val');
                var branch_model_id = $('[name="row[branch_model_id]"]').val();
                Fast.api.close({rows: rows,branch_model_id:branch_model_id});
            });
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"), null, null, function () {
                    if ($("#treeview").size() > 0) {
                        var r = $("#treeview").jstree("get_all_checked");
                        $("input[name='row[rules]']").val(r.join(','));
                    }
                    return true;
                });
                //渲染权限节点树
                //变更级别后需要重建节点树
                $(document).on("change", "select[name='row[pid]']", function () {
                    var pid = $(this).data("pid");
                    var id = $(this).data("id");
                    if ($(this).val() == id) {
                        $("option[value='" + pid + "']", this).prop("selected", true).change();
                        Backend.api.toastr.error(__('Can not change the parent to self'));
                        return false;
                    }
                    $.ajax({
                        url: "auth/group/roletree",
                        type: 'post',
                        dataType: 'json',
                        data: {id: id, pid: $(this).val()},
                        success: function (ret) {
                            if (ret.hasOwnProperty("code")) {
                                var data = ret.hasOwnProperty("data") && ret.data != "" ? ret.data : "";
                                if (ret.code === 1) {
                                    //销毁已有的节点树
                                    $("#treeview").jstree("destroy");
                                    Controller.api.rendertree(data);
                                } else {
                                    Backend.api.toastr.error(ret.data);
                                }
                            }
                        }, error: function (e) {
                            Backend.api.toastr.error(e.message);
                        }
                    });
                });
                //全选和展开
                $(document).on("click", "#checkall", function () {
                    $("#treeview").jstree($(this).prop("checked") ? "check_all" : "uncheck_all");
                });
                $(document).on("click", "#expandall", function () {
                    $("#treeview").jstree($(this).prop("checked") ? "open_all" : "close_all");
                });
                $("select[name='row[pid]']").trigger("change");
            },
            rendertree: function (content) {
                $("#treeview")
                        .on('redraw.jstree', function (e) {
                            $(".layer-footer").attr("domrefresh", Math.random());
                        })
                        .jstree({
                            "themes": {"stripes": true},
                            "checkbox": {
                                "keep_selected_style": false,
                            },
                            "types": {
                                "root": {
                                    "icon": "fa fa-folder-open",
                                },
                                "menu": {
                                    "icon": "fa fa-folder-open",
                                },
                                "file": {
                                    "icon": "fa fa-file-o",
                                }
                            },
                            "plugins": ["checkbox", "types"],
                            "core": {
                                'check_callback': true,
                                "data": content
                            }
                        });
            }
        }
    };
    return Controller;
});