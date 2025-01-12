<?php

namespace app\admin\controller;

use app\admin\model\Course;
use app\admin\model\Fields;
use app\admin\model\Modelx;
use app\admin\model\Scenery;
use app\admin\model\Sight;
use app\admin\model\Statistics;
use app\admin\model\TException;
use EasyWeChat\Foundation\Application;
use think\Config;
use think\Exception;
use think\Hook;
use think\Db;
use think\Loader;
use Endroid\QrCode\QrCode;

/**
 * 服务订单
 *
 * @icon fa fa-circle-o
 */
class Provider extends Cosmetic
{
    protected $model = null;
    protected $selectpageFields = [
        'name', 'idcode', 'id', 'state',
        'branch_model_id',
        'customer_model_id',
        'appoint_promotion_model_id'
    ];
    protected $selectpageShowFields = ['idcode'];

    public function _initialize()
    {
        $this->noNeedRight = array_merge($this->noNeedRight, []);
        parent::_initialize();
        $this->model = model("provider");
        $this->relationSearch = array_merge($this->relationSearch, ["promotion"]);
    }


    public function add() {
        if (!$this->request->isPost()) {
            $this->assignconfig('provider', Config::get("provider"));
            return parent::add();
        }
        $params = $this->request->post("row/a");
        if (!$params) {
            $this->error(__('Parameter %s can not be empty', ''));
        }
        $db = $this->model->getQuery();
        $db->startTrans();
        try {

            $result = $this->model->validate("provider.add")->allowField(true)->save($params);
            if ($result !== false) {
                $db->commit();
                Hook::listen('newprovider',$this->model);
                $this->success("", null, $this->model->visible([],true)->toArray());
            } else {
                $this->error($this->model->getError());
            }
        } catch (\think\Exception $e) {
            $db->rollback();
            $this->error($e->getMessage());
        }
    }


    protected function spectacle($model) {
        $branch_model_id = $this->request->param("branch_model_id");
        if (!$branch_model_id) {
            if ($this->auth->isSuperAdmin() || !$this->admin || !$this->admin['staff_id']) {
                return $model;
            }
        }
        $branch_model_id = $branch_model_id != null ?$branch_model_id: $this->staff->branch_model_id;

        $model->where("provider.branch_model_id", $branch_model_id);

        return $model;
    }
}
