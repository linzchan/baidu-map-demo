// 创建Map实例
var MAP = new BMap.Map("allmap");
var markerClusterer;
var mapDemo = function() {
    this.init();
    this.addEvent();
}
$.extend(mapDemo.prototype, {
    init: function(){
        // 百度地图API功能
        MAP.centerAndZoom(new BMap.Point(113.330,23.136), 14);  // 初始化地图,设置中心点坐标和地图级别
        MAP.addControl(new BMap.MapTypeControl());   //添加地图类型控件
        MAP.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    },
    addEvent: function(){
        var self = this;
        // 添加
        $('.j-set-point').on('click', function(){
            self.clearOverlay();
            self.createMapMaker(POINTDATA.data);
            return false;
            $.ajax({
                url: 'json/point.json',
                dataType: 'json',
                success: function(dt){
                    if(dt.code==200){
                        console.log('a')
                        self.createMapMaker(dt.data);
                    }
                }
            })
        });

        $('.j-set-points').on('click', function(){
            self.clearOverlay();
            self.createPointCollect(POINTSDATA.data);
            return false;
            $.ajax({
                url: 'json/points.json',
                dataType: 'json',
                success: function(dt){
                    if(dt.code == 200){
                        self.createPointCollect(dt.data);
                    }
                }
            })
        });

        $('.j-set-clusterer').on('click', function(){
            self.clearOverlay();
            self.createMakerClusterer();
        });
    },
    createMapMaker: function(data){
        var point = new BMap.Point(data.longitude, data.latitude)
        MAP.centerAndZoom(point, 15);
        var marker = new BMap.Marker(point);
        MAP.addOverlay(marker);
        var infoWindow = new BMap.InfoWindow(data.desc, data.opts);  // 创建信息窗口对象
        marker.addEventListener("click", function(){
            MAP.openInfoWindow(infoWindow,point); //开启信息窗口
        });
    },
    createPointCollect: function(data){
        // 判断当前浏览器是否支持绘制海量点
        if (document.createElement('canvas').getContext) {

            MAP.centerAndZoom(new BMap.Point(105.000, 38.000), 5);     // 初始化地图,设置中心点坐标和地图级别

            var points = [];  // 添加海量点数据
            for(var i=0;i<data.points.length;i++){
                points.push(new BMap.Point(data.points[i][0], data.points[i][1]))
            }
            var options = {
                size: BMAP_POINT_SIZE_SMALL ,
                shape: BMAP_POINT_SHAPE_STAR,
                color: '#d340c3'
            }
            var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
            pointCollection.addEventListener('click', function (e) {
                alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
            });
            MAP.addOverlay(pointCollection);  // 添加Overlay
        } else {
            alert('请在chrome、safari、IE8+以上浏览器查看本示例');
        }

    },
    createMakerClusterer: function(data){
        MAP.centerAndZoom(new BMap.Point(116.404, 39.915), 4);
        var MAX = 10;
        var markers = [];
        var pt = null;
        var i = 0;
        for (; i < MAX; i++) {
           pt = new BMap.Point(Math.random() * 40 + 85, Math.random() * 30 + 21);
           markers.push(new BMap.Marker(pt));
        }
        //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
        markerClusterer = new BMapLib.MarkerClusterer(MAP, {markers:markers});
        },
        clearOverlay: function(){
            MAP.clearOverlays();
            if(markerClusterer){
                markerClusterer.clearMarkers()
            }
        }
});

new mapDemo();
