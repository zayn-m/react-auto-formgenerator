export function objectToFormData(obj, rootName, ignoreList) {
  var formData = new FormData()

  function appendFormData(data, root) {
    if (!ignore(root)) {
      root = root || ""
      if (data instanceof File) {
        formData.append(root, data)
      } else if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          appendFormData(data[i], root + "[" + i + "]")
        }
      } else if (typeof data === "object" && data) {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            if (root === "") {
              appendFormData(data[key], key)
            } else {
              appendFormData(data[key], root + "." + key)
            }
          }
        }
      } else {
        if (data !== null && typeof data !== "undefined") {
          formData.append(root, data)
        }
      }
    }
  }

  function ignore(root) {
    return (
      Array.isArray(ignoreList) &&
      ignoreList.some(function (x) {
        return x === root
      })
    )
  }

  appendFormData(obj, rootName)

  return formData
}

export function getFieldName(fieldName) {
  const oldNum = fieldName.split("$")[1]
  const num = Number(fieldName.split("$")[1]) + 1
  return fieldName.replace(oldNum, num)
}

export function getNum(fldName) {
  return Number(fldName.split('$')[1]);
}

export function convertToArray(obj) {
  let fieldsArr = [];
  Object.keys(obj).forEach(field => {
    const num = getNum(field);
    fieldsArr[num] = {
      ...fieldsArr[num],
      [field]: {
        ...obj[field]
      }
    }
  });
  return fieldsArr;
}

export const selectStyles = {
  menu: (provided, state) => ({
    ...provided,
    
  }),
}