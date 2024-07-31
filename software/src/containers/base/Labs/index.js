import React, {Component} from 'react';
import {connect} from 'react-redux';
import EmptyPage from './components/EmptyPage';
import CustomProductPage from './components/CustomProductPage';
import mapState from '@src/redux/selector/mapState';
import mapDispatch from '@src/redux/selector/mapDispatch';
import './index.scss';

@connect(mapState, mapDispatch)
class Labs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreate: false
    }
  }
  componentDidMount() {
    this.getTreeDate();
    this.getCategoryList();
  }
  toCreatePage = () => {
    this.setState(() => ({
      showCreate: true
    }), () => {
      this.customProductRef && this.customProductRef.handleCreate();
    });
  }
  getTreeDate = () => {
    const {boundProjectActions:{getLabList, updateLabState}} = this.props;
    // 获取自定义产品列表
    return getLabList().then(res => {
      if(res.ret_code === 200000 && res.data) {
        updateLabState({
          listData: res.data
        });
      }
    });
  }
  getCategoryList = () => {
    const {boundProjectActions:{getCategoryList, updateLabState}} = this.props;
    getCategoryList().then(res => {
      if(res.ret_code === 200000 && res.data) {
        updateLabState({
          categoryList: res.data
        });
      }
    })
  }
  getCustomProductRef = ele => this.customProductRef = ele;
  render() {
    const {
      labs:{categoryList=[], treeData=[], allProducts={}, productNameList=[]},
      boundProjectActions,
      boundGlobalActions
    } = this.props;
    const {showCreate} = this.state;
    const treeProps = {
      ref: this.getCustomProductRef,
      categoryList,
      treeData,
      allProducts,
      productNameList,
      boundProjectActions,
      boundGlobalActions,
      getTreeDate: this.getTreeDate
    }
    return (
      <div className='custom-product-page-container'>
        {
          !treeData.length && !showCreate ? <EmptyPage onClick={this.toCreatePage} /> : <CustomProductPage {...treeProps} /> 
        }
      </div>
    )
  }
}

export default Labs;
