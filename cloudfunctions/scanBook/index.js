// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const cheerio = require('cheerio')
const doubanbook = require('doubanbook')
const qs = require('qs')

cloud.init()

// getFood()
async function getFood() {
  let url = 'https://yingyang.911cha.com/'
  let searchInfo = await axios.post(url, qs.stringify({
    q: '苹果'
  }))


  let $ = cheerio.load(searchInfo.data)
  let ret = []

  $('.l3.f14 li').each((i, v) => {
    let obj = {
      href: url + $(v).find('a').attr('href').replace(/^\.\//, ''),
      name: $(v).find('a').text()
    }
    ret.push(obj)
  })

  console.log(ret)
}

// getDouban('9787559445735')
async function searchDouban(code) {
  let searchInfo = await axios.get('https://search.douban.com/book/subject_search?search_text=' + code)
  let reg = /window\.__DATA__ = "(.*)"/

  if (reg.test(searchInfo.data)) {
    return doubanbook(RegExp.$1)[0]
  }
  return {}
}

async function getDouban(code) {
  let detail = await searchDouban(code)
  console.log('detail', detail)
  let detailPage = await axios.get(detail.url)
  let $ = cheerio.load(detailPage.data)
  let tags = []

  $('#db-tags-section a.tag').each((i, v) => {
    tags.push({
      title: $(v).text()
    })
  })

  const ret = {
    tags,
    create_time: Date.now(),
    image: detail.cover_url,
    rate: detail.rating.value,
    url: detail.url,
    title: detail.title,
    summary: $('#link-report .intro').text()
  }

  console.log('ret', ret)

  return ret
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { isbn } = event
  const data = await getDouban(isbn)
  return data
}




