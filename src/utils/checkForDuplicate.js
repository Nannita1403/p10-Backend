const checkForDuplicates = (oldArray, newArray) => {
    newArray = newArray.filter((element) => !oldArray.includes(element));
    newArray = [...oldArray, ...newArray];
  
    return newArray;
  };
  
  module.exports = { checkForDuplicates };