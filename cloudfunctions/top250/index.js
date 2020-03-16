// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const cheerio = require('cheerio')

cloud.init()

// getDouban()

async function getDouban() {
	let page = await axios.get('https://movie.douban.com/top250')
	let $ = cheerio.load(page.data)
	let ret = []

	$('.item').each((i, v) => {
		let title = $(v).find('.title').text()

		ret.push(title)
	})

	return ret
	// console.log(ret)
}

// 云函数入口函数
exports.main = async (event, context) => {
  let { a, b } = event
  let movies = await getDouban()

  return {
    sum: a + b,
    movies
  }
}