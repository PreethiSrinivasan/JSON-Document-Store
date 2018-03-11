/**
 * @author Sami Ahmad Khan <sami.ahmadkhan12@gmail.com>
 * @file Quantcast Coding Challenge 2018
 */

process.stdin.resume()
process.stdin.setEncoding("ascii")

let input = []

/**
 * [Standard IO collection]
 */
process.stdin.on("data", (chunk) => input.push(chunk.trim()))
process.stdin.on("end", function () {
    const output = execute(input)
    output.forEach((docs) => process.stdout.write(docs+'\n'))
})

/**
* Global variable for doc storage in memory -- Stack
**/
let store = []

/**
 * [Main Executor Function that dynamically calls ADD, GET and DELETE functions]
 * @param  {[object]} input [list of all the input calls from STDIN]
 * @return {[object]}       [all the matching results for given GET calls]
 */
const execute = (input) => {
  let matches = []
  input.forEach((line) => {
    const queryCommand = line.substr(0,line.indexOf(' '))
    const documentLine = line.substr(line.indexOf(' ')+1)
    if(queryCommand === 'add'){
      request.add(documentLine)
    }
    else if (queryCommand === 'get'){
      matches = matches.concat(request.get(documentLine))
    }
    else if (queryCommand === 'delete'){
      request.delete(documentLine)
    }
  })
  return matches
}

/**
 * [Request wrapper for add, get and remove functionality]
 * @type {Object}
 */
const request = {
    "add" : (data) => {
      store.push(data)
    },
    "get" : (queryLine) => {
      let matches = []
      store.forEach((line) => {
        if (doesMatch(line, queryLine) === true){
          matches.push(line)
        }
      })
      return matches
    },
    "delete" : (deleteLine) => {
      store.forEach((line) => {
        if (doesMatch(line, deleteLine) === true){
          removeFromStore(line)
        }
      })
    }
}

/************************* HELPER FUNCITONS ****************************/

/**
 * [Checks for documents(lines) that matches the Get call's document substring(queryLine)]
 * @param  {object} line              [line from the doc store]
 * @param  {string<object>} queryLine [queryLine to search for matching documents]
 * @return {boolean}                  return true or false based on comparison
 */
const doesMatch = (line, queryLine) => {
  let matchFlag = true

  for(let key in JSON.parse(queryLine)) {

    if(line.includes(key)){
      let value = JSON.parse(queryLine)[key]
      
      // If queried string has string value for the key
      if (typeof value === 'string'){
      	let pair = '"'+key+'"'+':'+'"'+value+'"'
        if(!line.includes(pair)){
          matchFlag = false
          break
        }
      }

      // If queried string has a number or boolean value for the key
      else if(typeof value === 'number' || typeof value === 'boolean'){
        let pair = '"'+key+'"'+':'+value
        if(!line.includes(pair)){
          matchFlag = false
          break
        }
      }

      // If queried string has nested object within, we compare the prototype chain
      else {
        value = JSON.parse(queryLine)[key]
        if(Array.isArray(value)){
          if(isSubArray(value, JSON.parse(line)[key]) === false){
            matchFlag = false
            break
          }
        } else {
          if(isSubObject(value, JSON.parse(line)[key]) === false){
            matchFlag = false
            break
          }
        }
      }
    }
  }
  return matchFlag
}

/**
 * [removes matching documents from the Store]
 * @param  {string<object>} line [line to be removed]
 * @return Modified global varibale store
 */
const removeFromStore = (line) => {
  store = store.filter(e => e !== line)
}

/**
 * [Checks if the array in the queried doc is a subarray of the main doc in Store]
 * @param  {array}  subArray  [array of queried doc]
 * @param  {array}  mainArray [array of main doc in Store]
 * @return {Boolean}           [flag]
 */
const isSubArray = (subArray, mainArray) => {
  let flag = true
  subArray.forEach((element) => {
    if(!mainArray.includes(element)){
      flag = false
    }
  })
  return flag
}

/**
 * [Checks if the object in the queried doc is a sub object of the main doc in Store]
 * @param  {array}  subObject  [object of queried doc]
 * @param  {array}  mainObject [object of main doc in Store]
 * @return {Boolean}           [flag]
 */
 const isSubObject = (subObject, mainObject) => {
   let flag = true
   Object.keys(subObject).forEach((key) => {
     if (typeof subObject[key] === 'string'){
       if (mainObject[key] != subObject[key]) {
         flag = false
       }
     } else {
       isSubObject(subObject[key], mainObject[key])
     }

   })
   return flag
 }
