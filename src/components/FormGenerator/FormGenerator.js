import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { Button, Input, Form, Collapse } from 'reactstrap';
import Select from 'react-select';
import Switch from "react-switch";
import AsyncSelect from 'react-select/async';
import Api from '../../lib/api';
import { toast } from 'react-toastify';
import { objectToFormData } from '../../lib/utils';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles.css';

export function FormGenerator(props) {
  const [fields, setFields] = useState({});
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setFields(props.fields);
    if (props.targetId) {
      remoteRequest();
    }
  }, [])

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
   * Handle input change event
   * @param {string} currentField 
   * @param {string} value 
   */
  const handleInputChange = (currentField, value) => {
    // changing values in static fields array
    setFields({
      ...fields,
      [currentField.name]: {
        ...fields[currentField.name],
        handleChange: true,
        value
      }
    });
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
	 * Return fields based on object array
	 * @param {Object} fieldsObject 
	 */
  const renderFields = (fieldsObject) => {
    if (!fieldsObject) return;

    let fields = fieldsObject;
		let colCount = 0;
		let finalData = [],
			rowData = [];

      function getField(currentField) {
        function getInput() {
          switch (currentField.type) {
            case 'text':
            case 'email':
            case 'password':
            case 'number':
              return (
                <input
                  {...currentField}
                  className={`form-control ${currentField.className}`}
                  label={currentField.label}
                  name={currentField.name}
                  value={currentField.value}
                  col={currentField.col}
                  id={currentField.name}
                  type={currentField.type}
                  onChange={(e) => {
                    handleInputChange(currentField, e.target.value);
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
                  onChange={(event) => handleInputChange(currentField, event)}
                />
              );

            case 'file':
              return (
                <input
                  className={`form-control ${currentField.className}`}
                  type="file" 
                  id={currentField.name} 
                  name={currentField.name} 
                  onChange={e => handleInputChange(currentField, e.target.files[0])} 
                />
              )

            case 'advanceSelect':
              // load options using API call
              const loadOptions = (inputValue) => {
                let targetUrl = '';
  
                if (inputValue) targetUrl = currentField.target + `?q=${inputValue}`;
                if (currentField.limit) targetUrl = currentField.target + `?limit=${currentField.limit}`;
                else targetUrl = currentField.target;
  
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
                  handleInputChange(currentField, value ? value.map(v => v[currentField.optionValue]) : [] );
                } else {
                  handleInputChange(currentField, value[currentField.optionValue]);
                }
              }
  
              if (currentField.target) {
                return (
                  <AsyncSelect
                    {...currentField}
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
                        : v[v.length - 1][currentField.optionValue].toString()
                    );
                  } else {
                    handleInputChange(currentField, v.value);
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
                    {...currentField}
                    cacheOptions
                    defaultOptions
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
            <div className="invalid-feedback d-block">{currentField.error}</div>
          </div>
        );
        return field;
      }
  
      Object.keys(fields).forEach((field, index, fieldsArr) => {
        let currentField = fields[field],
          inputField = '';
        colCount += currentField.col || 12;
        inputField = getField(currentField);
  
        rowData.push(inputField);
  
        if (colCount > 11 || fieldsArr.length === index + 1) {
          if (currentField.type === 'section') {
            finalData.push(
              <div key={index} className="section">
                <h4 onClick={() => toggleSection(currentField)} >{currentField.label}</h4>
                <div className={`collapse ${currentField.show ? 'show': ''}`} id={currentField.name}>
                  {renderFields(currentField.fields)}
                </div>
              </div>
            );
          } else {
            finalData.push(
              <div key={index} className="row">
                {rowData}
              </div>
            );
          }
          colCount = 0;
          rowData = [];
        }
      });
      return finalData;
  };

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
			data = {
				...data,
				[field]: fields[field].value
			};
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
  };

  return (
    <form onSubmit={submit} className={props.formClassName}>
      {renderFields(fields)}
      <button className={`mt-3 btn btn-success ${props.btnClassName}`} disabled={loading}>Submit</button>
    </form>
  )
}

FormGenerator.propTypes = {
  idKey: PropTypes.string.isRequired,
  apiUrl: PropTypes.string.isRequired,
	fields: PropTypes.object.isRequired,
	entity: PropTypes.string.isRequired,
	targetId: PropTypes.number.isRequired | PropTypes.string.isRequired,
  submitCb: PropTypes.func,
  showToast: PropTypes.bool.isRequired,
  formClassName: PropTypes.string,
  btnClassName: PropTypes.string
}