import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Switch from "react-switch";
import AsyncSelect from 'react-select/async';
import Api from '../../lib/api';
import { toast } from 'react-toastify';
import { objectToFormData, getFieldName, convertToArray, getNum, selectStyles } from '../../lib/utils';
import { addIcon, removeIcon } from '../../lib/svgs';

import 'react-toastify/dist/ReactToastify.css';
import '../../assets/bootstrap-grid.css';
import '../../assets/styles.css';

export function FormGenerator(props) {
  const [fields, setFields] = useState({});
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPropFieldsToState();
    if (props.targetId) {
      remoteRequest();
    }
  }, [])

  const setPropFieldsToState = () => {
    let propFields = JSON.parse(JSON.stringify(props.fields));
    let repeaterFields;
    // changing structure for repeaters
    Object.keys(propFields).forEach(field => {
      if (props.fields[field].type && props.fields[field].type === 'repeater') {
        repeaterFields = propFields[field].fields;
        Object.keys(repeaterFields).forEach(f => {
          // creating new fields and deleting old,
          // doing this because newly dynamic generated fields will have indexes as unique names
          const propKey = `${f}$0`;
          repeaterFields[propKey] = {
            ...repeaterFields[f],
            name: propKey
          };
          delete repeaterFields[f];
        })
        repeaterFields['remove$0'] = {
          type: 'remove',
          name: 'remove$0', 
          section: true,
          col: 1
        };
        propFields[field].fields = { ...repeaterFields };
      }
    })
    setFields(propFields);
  }

  // Fetch data from api in edit mode
  const remoteRequest = async () => {
    const { entity, targetId } = props;
    try {
      const res = await new Api(props.apiUrl).request('get', `/${entity}/${targetId}`);
      // map data from request to fields
      Object.keys(res.data).forEach((dataField) => {
        Object.keys(fields).forEach((stateField) => {
          if (stateField === dataField) {
            handleInputChange(fields[stateField], res.data[dataField]);
          }
        })
        setData(res.data);
      })
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Handle input change events
   * @param {string} currentField 
   * @param {string} value
   * @param {Object} schema
   */
  const handleInputChange = (currentField, value, schema) => {
    // changing values in static fields array
    if (schema && schema.type === 'repeater') {
      setFields({
        ...fields,
        [schema.name]: {
          ...schema,
          fields: {
            ...schema.fields,
            [currentField.name]: {
              ...currentField,
              handleChange: true,
              value
            }
          }
        }
      })
    } else {
      setFields({
        ...fields,
        [currentField.name]: {
          ...fields[currentField.name],
          handleChange: true,
          value
        }
      });
    }
  }

  /**
   * This handles toggle of sections
   * @param {Object} currentField 
   */
  const toggleSection = (currentField) => {
    setFields({
      ...fields,
      [currentField.name]: {
        ...fields[currentField.name],
        show: !currentField.show
      }
    });
  }
  /**
   * This is used to render HTML fields using objects
   * @param {Object} currentField 
   * @param {Object} schema
   * @returns HTML
   */
  const getField = (currentField, schema) => {
    function getInput() {
      switch (currentField.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
          return (
            <input
              className={`r-fg-formcontrol ${currentField.className}`}
              placeholder={currentField.placeholder}
              label={currentField.label}
              name={currentField.name}
              value={currentField.value}
              col={currentField.col}
              id={currentField.name}
              type={currentField.type}
              onChange={(e) => {
                handleInputChange(currentField, e.target.value, schema);
              }}
            />
          );

        case 'switch':
          return (
            <Switch
              className={currentField.className}
              checked={currentField.value}
              id={currentField.name}
              handleDiameter={25}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={20}
              width={48}
              onChange={(event) => handleInputChange(currentField, event, schema)}
            />
          );

        case 'file':
          return (
            <input
              className={`r-fg-formcontrol ${currentField.className}`}
              type="file" 
              id={currentField.name} 
              name={currentField.name} 
              onChange={e => handleInputChange(currentField, e.target.files[0], schema)} 
            />
          )

        case 'remove':
          return (
            <span className='r-fg-remove-group' onClick={() => removeGroupFields(currentField.name, schema.name)}>
              {removeIcon()}
            </span>
          )

        case 'advanceSelect':
          // load options using API call
          const loadOptions = (inputValue) => {
            let targetUrl = '';

            if (inputValue) targetUrl = currentField.target + `?q=${inputValue}`;
            if (currentField.limit) targetUrl = currentField.target + `?limit=${currentField.limit}`;
            else targetUrl = currentField.target;

            // TODO: handle cases for sections
            return new Api(props.apiUrl).request('get', targetUrl).then((res) => {  
              const optionsToSet = {
                ...fields,
                [currentField.name]: {
                  ...currentField,
                  options: res.data
                }
              };
              setFields(optionsToSet);
              
              return res.data;
            });
          };

          const onSelect = (value) => {
            if (currentField.multi) {
              handleInputChange(currentField, value ? value.map(v => v[currentField.optionValue]) : [], schema);
            } else {
              handleInputChange(currentField, value[currentField.optionValue], schema);
            }
          }

          if (currentField.target) {
            return (
              <AsyncSelect
                className={`r-fg-select ${currentField.className}`}
                styles={selectStyles}
                placeholder={currentField.placeholder}
                isSearchable={currentField.search}
                isDisabled={currentField.disabled}
                cacheOptions
                defaultOptions
                isMulti={currentField?.multi ?? false}
                value={
                  currentField.handleChange && currentField.options ? (
                    currentField.options.find((op) => op[currentField.optionValue] === currentField.value)
                  ) : currentField.options ? (
                    currentField.options.filter(op => data[currentField.name]?.includes(op[currentField.optionValue]) ?? null)
                  ) : (
                    currentField.value
                  )
                }
                defaultValue={currentField.value}
                getOptionLabel={(e) =>
                  currentField.optionLabel ? e[currentField.optionLabel] : e.title}
                getOptionValue={(e) => e[currentField.optionValue]}
                loadOptions={loadOptions}
                onChange={(v) => onSelect(v)}
              />
            );
          } else {
            function setValue(v, prev) {
              if ((v && Array.isArray(v)) || v === null) {
                handleInputChange(
                  currentField,
                  prev.removedValue
                    ? prev.removedValue[currentField.optionValue].toString()
                    : v[v.length - 1][currentField.optionValue].toString(),
                  schema
                );
              } else {
                handleInputChange(currentField, v.value, schema);
              }
            }

            function populateMultiValue(value, options) {
              return options.map((item) => {
                const res = value.map(function(v) {
                  return v.toString();
                });
                if (res.includes(item[currentField.optionValue].toString())) {
                  return item;
                }
              });
            }
            return (
              <Select
                styles={selectStyles}
                cacheOptions
                defaultOptions
                className={`r-fg-select ${currentField.className}`}
                placeholder={currentField.placeholder}
                isDisabled={currentField.disabled}
                options={currentField.options}
                isMulti={currentField.type_id === 'multiselect' ? true : false}
                value={
                  currentField.value ? Array.isArray(currentField.value) ? (
                    populateMultiValue(currentField.value, currentField.options)
                  ) : (
                    currentField.options.find((option) => option._id == currentField.value)
                  ) : (
                    ''
                  )
                }
                onChange={(v, prev) => setValue(v, prev)}
              />
            );
          }

        default:
          break;
      }
    }

    let field = (
      <div key={currentField.name} className={`col-${currentField.col} form-group`}>
        <label htmlFor={currentField.name}>{currentField.label}</label> <br />
        {getInput()}
        <div className="r-fg-invalid-feedback d-block">{currentField.error}</div>
      </div>
    );
    return field;
  }

  const addGroupFields = (name) => {

    const stateFields = {...fields};
    Object.keys(stateFields[name].fields).forEach(fld => {
      const fldObject = stateFields[name].fields[fld];
      stateFields[name].fields[getFieldName(fld)] = {
        ...fldObject,
        value: '',
        name: getFieldName(fld)
      };      
    })
    setFields(stateFields);
  }

  const removeGroupFields = (name, schemaName) => {
    const num = name.split('$')[1];
    if (num === '0') return;
    const stateFields = {...fields};

    // converting objects into array to keep track of indexes when deleting
    let fieldsArr = [];
    fieldsArr = convertToArray(stateFields[schemaName].fields);
    fieldsArr.splice(getNum(name), 1);

    for (let [indx, field] of fieldsArr.entries()) {
      Object.keys(field).forEach(fldObjKey => {
        fieldsArr[indx] = {
          ...fieldsArr[indx],
          [`${fldObjKey.split('$')[0]}$${indx}`]: {
            ...field[fldObjKey],
            name: `${fldObjKey.split('$')[0]}$${indx}`
          }
        }
        // deleting duplicated field objects
        if (fldObjKey.split('$')[1] != indx) {
          delete fieldsArr[indx][fldObjKey];
        }
      })
    }

    let finalObj = {};

    for (let obj of fieldsArr) {
      finalObj = {
        ...finalObj,
        ...obj
      }
    }
    stateFields[schemaName].fields = finalObj;
    setFields(stateFields);
  }

  const renderRepeater = (currentField) => {
    if (!currentField || !currentField.fields) return <div>No fields schema object</div>;

    let finalData = renderFields(currentField.fields, currentField);
    finalData.push(
      <div className='r-fg-new-btn-group'>
        {addIcon()} <small onClick={() => addGroupFields(currentField.name)}>{currentField.newBtnLabel}</small>
      </div>
    )
    return finalData;

  }

  const renderSection = (currentField, index) => {
    return (
      <div key={index} className='r-fg-section'>
        <input 
          id={currentField.name} 
          className='r-fg-section-input' 
          type='checkbox' 
        />
        <label 
          htmlFor={currentField.name} 
          className='lbl-toggle' 
          onClick={() => toggleSection(currentField)}
        >
          {currentField.label}
        </label>
        <div 
          className={`r-fg-section-content ${currentField.show ? 'show': ''}`} 
          id={currentField.name}
        >
          {currentField.type === 'repeater' ? renderRepeater(currentField, index) : renderFields(currentField.fields)}
        </div>
      </div>
    )
  }

  /**
	 * Return fields based on object array
	 * @param {Object} fieldsObject 
   * @param {Object} schema
	 */
  const renderFields = (fieldsObject, schema) => {
    if (!fieldsObject) return;

    let fields = fieldsObject;
		let colCount = 0;
		let finalData = [],
			rowData = [];

      // making HTML from field objects and pushing to finalData
      Object.keys(fields).forEach((field, index, fieldsArr) => {
        let currentField = fields[field],
          inputField = '';
        colCount += currentField.col || 12;
        inputField = getField(currentField, schema);
  
        rowData.push(inputField);
  
        if (colCount > 11 || fieldsArr.length === index + 1) {
          if (['section', 'repeater'].includes(currentField.type)) {
            finalData.push(renderSection(currentField, index, schema));
          } else {
            finalData.push(
              <div key={index} className='row'>
                {rowData}
              </div>
            );
          }
          colCount = 0;
          rowData = [];
        }
      });
      return finalData;
  }

  const resetForm = () => {
    Object.keys(fields).forEach(field =>{
      fields[field] = {
        ...fields[field],
        value: '',
        error: ''
      }
    })
  }

  const submit = (e) => {
		e.preventDefault();

    setLoading(true);
    
		const { targetId, entity } = props;
		let data = {};
		const url = targetId ? `/${entity}/${targetId}` : `/${entity}`;
		let type = targetId ? 'patch' : 'post';

		Object.keys(fields).forEach((field) => {
      if (fields[field].type === 'repeater') {
        // linearize to array
        let arr = convertToArray(fields[field].fields);
        for (let [indx, obj] of arr.entries()) {
          Object.keys(obj).forEach(objKey => {
            arr[indx] = {
              ...arr[indx],
              [objKey.split('$')[0]]: obj[objKey].value
            }
            delete arr[indx][objKey];
          })
        }

        data = {
          ...data,
          [field]: arr
        }

      } else {
        data = {
          ...data,
          [field]: fields[field].value
        };
      }
		});
    
    data = objectToFormData(data);

		new Api(props.apiUrl).request(type, url, data)
			.then((res) => {
				if (props.showToast) toast.success('Success');
        if (props.submitCb) props.submitCb(res.data);
        resetForm();
			})
			.catch((err) => {
        console.log(err);
				if (err.response?.data?.errors) {
					Object.keys(fields).forEach(field =>{
						fields[field] = {
							...fields[field],
							error: err.response.data.errors[field]
						}
					})
          setErrors(err.response.data.errors);
          setFields(fields);
					if (props.showToast) toast.error('Please resolve errors');
				} else {
					if (props.showToast) toast.error('Something went wrong');
				}
			})
			.finally(() => {
        setLoading(false);
			});
  }

  return (
    <form onSubmit={submit} className={props.formClassName}>
      {renderFields(fields)}
      <button className={`r-fg-btn ${props.btnClassName}`} disabled={loading}>Submit</button>
    </form>
  )
}

FormGenerator.propTypes = {
  idKey: PropTypes.string.isRequired,
  apiUrl: PropTypes.string.isRequired,
	fields: PropTypes.object.isRequired,
	entity: PropTypes.string.isRequired,
	targetId: PropTypes.string,
  submitCb: PropTypes.func,
  showToast: PropTypes.bool.isRequired,
  formClassName: PropTypes.string,
  btnClassName: PropTypes.string
}