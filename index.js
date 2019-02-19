const fs = require('fs')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2));

function getUsage() {
  return 'Usage: node index.js [--utility="<utility_value>"] [--cpiaux="<cpiAux_value">] [--campaigntype="<CampaignType_value>"] <filename>'
}

if (argv.help || argv.h) {
  console.log(getUsage())
  process.exit(0)
}

const paramSet = new Set()
paramSet.add('_')
paramSet.add('utility')
paramSet.add('cpiaux')
paramSet.add('campaigntype')

const invalidParams = Object.keys(argv).filter((param) => {
  const paramTest = paramSet.has(param)
  !paramTest ? console.error(`Error. Unknown parameter '${param}'.`) : null
  return !paramTest
})

if (invalidParams.length) {
  console.log(getUsage())
  process.exit(1)
}

const fileName = argv._[0]

if(!fileName) {
  console.error(`Error. Filename isn\'t specified`)
  process.exit(1)
}

const filePath = !path.isAbsolute(fileName) ?  path.join(process.cwd(), fileName) : fileName

if (!fs.existsSync(filePath)){
  console.error(`Error. File \'${filePath}\' doesn\'t exist`)
  process.exit(1)
}

let  data
try {
  data = fs.readFileSync(filePath, 'utf8')
} catch (err) {
  console.error('Error.' , err.message)
  process.exit(1)
}

const jsData = JSON.parse(data)

const filteredData = jsData.filter((obj) => {
  let sign = true

  sign = argv.utility ? sign && (obj.UtilityCo == argv.utility) : sign
  sign = argv.cpiaux ? sign && (obj.CpiAuxiliary1 == argv.cpiaux) : sign

  return argv.campaigntype ? sign && (obj.CampaignType == argv.campaigntype) : sign
})

console.log(filteredData)
console.log(`${filteredData.length} matches found from total of ${jsData.length} elements`) 