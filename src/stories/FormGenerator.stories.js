import React from 'react';
import { storiesOf } from '@storybook/react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { FormGenerator } from '../components/FormGenerator';
import { userFields, candidateFields } from './types';

const stories = storiesOf('Forms', module);
stories.add('UserForm', () => {
  return (
    <div className='row w-100 vh-90 pt-5  '>
      <div className='col-8 mx-auto'>
        <Card>
          <CardHeader>
            <strong>Add User</strong>
          </CardHeader>
          <CardBody>
            <FormGenerator 
              fields={userFields}
              idKey='_id'
              apiUrl='https://react-auto-formgenerator.herokuapp.com' 
              entity='users'
              showToast={true}
              submitCb={data => console.log('form submitted', data)}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
});

stories.add('CandidateForm', () => {
  return (
    <div className='row w-100 vh-90 pt-5'>
      <div className='col-8 mx-auto'>
        <Card>
          <CardHeader>
            <strong>Add Candidate</strong>
          </CardHeader>
          <CardBody>
            <FormGenerator 
              fields={candidateFields}
              idKey='_id'
              apiUrl='https://react-auto-formgenerator.herokuapp.com'
              entity='users'
              showToast={true}
              submitCb={data => console.log('form submitted', data)}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
});