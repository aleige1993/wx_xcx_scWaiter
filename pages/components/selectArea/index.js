// pages/components/selectArea/index.js
let app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean,
    code: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    showArea: true,
    loading: false,
    areaList: {},
    selectedCode: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      this.triggerEvent('onClose');
    },
    onConfirm(data) {
      this.triggerEvent('onConfirm', data);
    }
  },

  ready() {
    // console.log(this.data.code);
    this.setData({
      loading: true
    });
    app.Formdata.post('/openapi/common/regions', {}, (res) => {
      // console.log(res);
      if (res.success && res.success === "true") {
        let province_list = {};
        let city_list = {};
        let county_list = {};
        res.data.map(provinceItem => {
          province_list[provinceItem.provinceId] = provinceItem.provinceName;
          if (provinceItem.cityList) {
            provinceItem.cityList.map(cityItem => {
              city_list[cityItem.cityId] = cityItem.cityName;
              if (cityItem.districtList) {
                cityItem.districtList.map(districtItem => {
                  if (districtItem.districtId < 820009) {
                    county_list[districtItem.districtId] = districtItem.districtName;
                  }
                })
              }
            });
          }
        });
        // console.log(JSON.stringify({
        //   province_list,
        //   city_list,
        //   county_list
        // }))
        this.setData({
          areaList: {
            province_list,
            city_list,
            county_list
          },
          selectedCode: this.data.code,
          loading: false
        })
      }
    });
  }
})
