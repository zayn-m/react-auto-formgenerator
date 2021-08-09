import React from 'react';
import { storiesOf } from '@storybook/react';
import { FormGenerator } from '../components/FormGenerator';
import { userFields, candidateFields, productFields } from './types';

const stories = storiesOf('Forms', module);
stories.add('User Form', () => {
  return (
    <div className='row w-100 vh-90 pt-5  '>
      <div className='col-8 mx-auto'>
        <div className='card'>
          <div className='card-header'>
            <strong>Add User</strong>
          </div>
          <br />
          <div className='card-body'>
            <FormGenerator 
              fields={userFields}
              idKey='_id'
              apiUrl='https://react-auto-formgenerator.herokuapp.com' 
              entity='users'
              showToast={true}
              submitCb={data => console.log('form submitted', data)}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

stories.add('Candidate Form', () => {
  return (
    <div className='row w-100 vh-90 pt-5'>
      <div className='col-8 mx-auto'>
        <div className='card'>
          <div className='card-header'>
            <strong>Add Candidate</strong>
          </div>
          <br />
          <div className='card-body'>
            <FormGenerator 
              fields={candidateFields}
              idKey='_id'
              apiUrl='https://react-auto-formgenerator.herokuapp.com'
              entity='users'
              showToast={true}
              submitCb={data => console.log('form submitted', data)}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
