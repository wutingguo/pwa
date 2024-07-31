const { name } = require('./package.json');
const path = require('path');

function resolve(pathname) {
  return path.resolve(__dirname, pathname);
}

module.exports = {
  name,
  rules: `
# common
*/clientassets/ $1/clientassets/
# ^yun.cnzno.com.dd/$ ${resolve('./software/dist/assets/dashboard-mobile/app.html')}
# ^yun.cnzno.com.dd/*.js ${resolve('./software/dist/assets/dashboard-mobile/$1.js')}
# ^yun.cnzno.com.dd/*.css ${resolve('./software/dist/assets/dashboard-mobile/$1.css')}
# saas t环境
/saas.zno.com.t/.*sw.js/ resHeaders://${path.resolve('./response-headers.txt')}
/saas.zno.com.t/($|software|designer)([^.]*)$([^.]*)$/ ${resolve('./build/app.html')}
/saas.zno.com.t/(config|navbar|software|designer|common-deps|manifest)([^.]+).(js|css|png|jpg|gif|svg|json|wasm)(.map)*$/ ${resolve(
    './build'
  )}/$1$2.$3$4

# zno t环境
/www.zno.com.t/.*sw.js/ resHeaders://${path.resolve('./response-headers.txt')}
/www.zno.com.t/($|software|designer)([^.]*)$([^.]*)$/ ${resolve('./build/app.html')}
/www.zno.com.t/(config|navbar|software|designer|common-deps|manifest)([^.]+).(js|css|png|jpg|gif|svg|json|wasm)(.map)*$/ ${resolve(
    './build'
  )}/$1$2.$3$4
/www.zno.com.t/socket.io/socket.io.js/ http://localhost:8001/socket.io/socket.io.js
/www.zno.com.t/___services/ http://localhost:8001/___services
/www.zno.com.t/commons.js/ ${resolve('./saas-portal-zno/znoplus/public/assets/commons.js')}
*/sign-out.html $1/sign-out.html
/www.zno.com.t/commons.js.map/ ${resolve('./saas-portal-zno/znoplus/public/assets/commons.js.map')}
^www.zno.com.t/*.html ${resolve('./saas-portal-zno/znoplus/public/assets/index.html')}
/www.zno.com.t/page-data\/(.*?)\/page-data\.json$/ ${resolve(
    './saas-portal-zno/znoplus/public/assets/page-data'
  )}/$1/page-data.json

# cloud.zno.com t环境
/cloud.zno.com.t/.*sw.js/ resHeaders://${path.resolve('./response-headers.txt')}
/cloud.zno.com.t/($|software|designer)([^.]*)$([^.]*)$/ ${resolve('./build/app.html')}
/cloud.zno.com.t/(config|navbar|software|designer|common-deps|manifest)([^.]+).(js|css|png|jpg|gif|svg|json|wasm)(.map)*$/ ${resolve(
    './build'
  )}/$1$2.$3$4
/cloud.zno.com.t/socket.io/socket.io.js/ http://localhost:8001/socket.io/socket.io.js
/cloud.zno.com.t/___services/ http://localhost:8001/___services
/cloud.zno.com.t/commons.js/ ${resolve('./saas-portal-zno/znoplus/public/assets/commons.js')}
*/sign-out.html $1/sign-out.html
/cloud.zno.com.t/commons.js.map/ ${resolve(
    './saas-portal-zno/znoplus/public/assets/commons.js.map'
  )}
^cloud.zno.com.t/*.html ${resolve('./saas-portal-zno/znoplus/public/assets/index.html')}
/cloud.zno.com.t/page-data\/(.*?)\/page-data\.json$/ ${resolve(
    './saas-portal-zno/znoplus/public/assets/page-data'
  )}/$1/page-data.json
  
# cloud.zno.com d环境
/cloud.zno.com.d/.*sw.js/ resHeaders://${path.resolve('./response-headers.txt')}
/cloud.zno.com.d/($|software|designer)([^.]*)$([^.]*)$/ ${resolve('./build/app.html')}
/cloud.zno.com.d/(config|navbar|software|designer|common-deps|manifest)([^.]+).(js|css|png|jpg|gif|svg|json|wasm)(.map)*$/ ${resolve(
    './build'
  )}/$1$2.$3$4
/cloud.zno.com.d/socket.io/socket.io.js/ http://localhost:8001/socket.io/socket.io.js
/cloud.zno.com.d/___services/ http://localhost:8001/___services
/cloud.zno.com.d/commons.js/ ${resolve('./saas-portal-zno/znoplus/public/assets/commons.js')}
*/sign-out.html $1/sign-out.html
/cloud.zno.com.d/commons.js.map/ ${resolve(
    './saas-portal-zno/znoplus/public/assets/commons.js.map'
  )}
^cloud.zno.com.d/*.html ${resolve('./saas-portal-zno/znoplus/public/assets/index.html')}
/cloud.zno.com.d/page-data\/(.*?)\/page-data\.json$/ ${resolve(
    './saas-portal-zno/znoplus/public/assets/page-data'
  )}/$1/page-data.json  


# saas t7环境
/saas.zno.com.t7/.*sw.js/ resHeaders://${path.resolve('./response-headers.txt')}
/saas.zno.com.t7/($|software|designer)([^.]*)$/ ${resolve('./build/app.html')}
/saas.zno.com.t7/(config|navbar|software|designer|common-deps|manifest)([^.]+).(js|css|png|jpg|gif|svg|json|wasm)(.map)*$/ ${resolve(
    './build'
  )}/$1$2.$3$4

# zno t7环境
/www.zno.com.t7/.*sw.js/ resHeaders://${path.resolve('./response-headers.txt')}
/www.zno.com.t7/($|software|designer)([^.]*)$([^.]*)$/ ${resolve('./build/app.html')}
/www.zno.com.t7/(config|navbar|software|designer|common-deps|manifest)([^.]+).(js|css|png|jpg|gif|svg|json|wasm)(.map)*$/ ${resolve(
    './build'
  )}/$1$2.$3$4

# saas d环境
/saas.zno.com.d/.*sw.js/ resHeaders://${path.resolve('./response-headers.txt')}
/saas.zno.com.d/($|software|designer)([^.]*)$/ ${resolve('./build/app.html')}
/saas.zno.com.d/(config|navbar|software|designer|common-deps|manifest)([^.]+).(js|css|png|jpg|gif|svg|json|wasm)(.map)*$/ ${resolve(
    './build'
  )}/$1$2.$3$4
/www.zno.com.d/socket.io/socket.io.js/ http://localhost:8001/socket.io/socket.io.js
/www.zno.com.d/___services/ http://localhost:8001/___services
/www.zno.com.d/commons.js/ ${resolve('./saas-portal-zno/pc/public/assets/commons.js')}
/www.zno.com.d/commons.js.map/ ${resolve('./saas-portal-zno/pc/public/assets/commons.js.map')}
^www.zno.com.d/*.html ${resolve('./saas-portal-zno/pc/public/assets/index.html')}
/www.zno.com.d/page-data\/(.*?)\.html\/page-data\.json$/ ${resolve(
    './saas-portal-zno/pc/public/page-data/$1.html/page-data.json'
  )}

# zno d环境
/www.zno.com.d/.*sw.js/ resHeaders://${path.resolve('./response-headers.txt')}
/www.zno.com.d/($|software|designer)([^.]*)$([^.]*)$/ ${resolve('./build/app.html')}
/www.zno.com.d/(config|navbar|software|designer|common-deps|manifest)([^.]+).(js|css|png|jpg|gif|svg|json|wasm)(.map)*$/ ${resolve(
    './build'
  )}/$1$2.$3$4

# cunxin tt环境
/www.cnzno.com.tt/.*sw.js/ resHeaders://${path.resolve('./response-headers.txt')}
/www.cnzno.com.tt/($|software|designer)([^.]*)$([^.]*)$/ ${resolve('./build/app.html')}
/www.cnzno.com.tt/(config|navbar|software|designer|common-deps|manifest)([^.]+).(js|css|png|jpg|gif|svg|json|wasm)(.map)*$/ ${resolve(
    './build'
  )}/$1$2.$3$4
  
# 匿名分享环境 影像
webproofing.asovx.com.tt/selection-client/ ${resolve(
    './software/dist/assets/selection-client-mobile/'
  )}/
webproofing.asovx.com.tt/gallery-client/ ${resolve('./software/dist/assets/gallery-client/')}/
webproofing.asovx.com.tt/gallery-client/ ${resolve('./software/dist/assets/gallery-client/')}/
webproofing.asovx.com.tt/gallery-client/ ${resolve(
    './software/dist/assets/gallery-client-mobile/'
  )}/
# 匿名分享环境 影像
webproofing.asovx.com.tt/commodity-client/ ${resolve('./software/dist/assets/commodity-client/')}/
webproofing.asovx.com.tt/commodity-client/ ${resolve('./software/dist/assets/commodity-client/')}/
webproofing.asovx.com.tt/commodity-client/ ${resolve(
    './software/dist/assets/commodity-client-mobile/'
  )}/
# 匿名分享环境 zno
webproofing.asovx.com.d/selection-client/ ${resolve(
    './software/dist/assets/selection-client-mobile/'
  )}/
webproofing.asovx.com.d/gallery-client/ ${resolve('./software/dist/assets/gallery-client/')}/
webproofing.asovx.com.d/gallery-client/ ${resolve('./software/dist/assets/gallery-client-mobile/')}/
(\\w+[-]?\\w+).mypixhome.com.d/*/ ${resolve('./software/dist/assets/gallery-client/')}/
brad-photos1.mypixhome.com.d/123456551/ ${resolve('./software/dist/assets/gallery-client/')}/
webproofing.asovx.com.d/website-tool-client/ ${resolve(
    './software/dist/assets/website-tool-client/'
  )}/

webproofing.asovx.com.t/selection-client/ ${resolve(
    './software/dist/assets/selection-client-mobile/'
  )}/
webproofing.asovx.com.t/gallery-client/ ${resolve('./software/dist/assets/gallery-client/')}/
webproofing.asovx.com.t/gallery-client/ ${resolve('./software/dist/assets/gallery-client-mobile/')}/
webproofing.asovx.com.t/website-tool-client/ ${resolve(
    './software/dist/assets/website-tool-client/'
  )}/
pyue5yed.mypixhome.com.t/newj25g/  ${resolve('./software/dist/assets/gallery-client-mobile/')}/
# 匿名分享环境
webproofing.asovx.com.d/selection-client/ ${resolve(
    './software/dist/assets/selection-client-mobile/'
  )}/
webproofing.asovx.com.t/slide-show-client/ ${resolve('./software/dist/assets/slide-show-client/')}/
webproofing.asovx.com.t/slide-show-client/ ${resolve(
    './software/dist/assets/slide-show-client-mobile/'
  )}/

# 照片直播环境
www.cnasovx.com.dd/live-photo-client/ ${resolve(
    './software/dist/assets/live-photo-client-mobile/'
  )}/
www.cnasovx.com.dd/live-photo-client/ ${resolve('./software/dist/assets/live-photo-client/')}/
www.asovx.com.d/live-photo-client/ ${resolve('./software/dist/assets/live-photo-client-mobile/')}/
www.asovx.com.d/live-photo-client/ ${resolve('./software/dist/assets/live-photo-client/')}/
# yun tt环境

/yun.cnzno.com.tt/socket.io/socket.io.js/ http://localhost:8001/socket.io/socket.io.js
/yun.cnzno.com.tt/___services/ http://localhost:8001/___services
/yun.cnzno.com.tt/commons.js/ ${resolve('./saas-portal/pc/public/commons.js')}
/yun.cnzno.com.tt/commons.js.map/ ${resolve('./saas-portal/pc/public/commons.js.map')}
^yun.cnzno.com.tt/*.html ${resolve('./saas-portal/pc/public/index.html')}

/yun.cnzno.com.tt/($|software|designer)([^.]*)$/ ${resolve('./build/app.html')}
/yun.cnzno.com.tt/.*sw.js/ resHeaders://${path.resolve('./response-headers.txt')}
/yun.cnzno.com.tt/(config|navbar|software|designer|common-deps|manifest)([^.]+).(js|css|png|jpg|gif|svg|json|wasm)(.map)*$/ ${resolve(
    './build'
  )}/$1$2.$3$4

# yun dd环境
/yun.cnzno.com.dd/socket.io/socket.io.js/ http://localhost:8001/socket.io/socket.io.js
/yun.cnzno.com.dd/___services/ http://localhost:8001/___services
/yun.cnzno.com.dd/commons.js/ ${resolve('./saas-portal/pc/public/commons.js')}
/yun.cnzno.com.dd/commons.js.map/ ${resolve('./saas-portal/pc/public/commons.js.map')}
^yun.cnzno.com.dd/*.html ${resolve('./saas-portal/pc/public/index.html')}
/yun.cnzno.com.dd/.*sw.js/ resHeaders://${path.resolve('./response-headers.txt')}
/yun.cnzno.com.dd/(config|navbar|software|designer|common-deps|manifest)([^.]+).(js|css|png|jpg|gif|svg|json|wasm)(.map)*$/ ${resolve(
    './build'
  )}/$1$2.$3$4
/yun.cnzno.com.dd/($|software|designer)([^.]*)$/ ${resolve('./build/app.html')}
`,
};
