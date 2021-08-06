# FormGenerator-React

A form generator for [React](https://reactjs.org/). If you don't want to write lot of forms then use this component to generate 
forms by providing array of fields and it will generate forms from it. 

See [formgenerator-react](https://zayn-m.github.io/formgenerator-react/) for live storybook.

# Installation and usage 

The easiest way to formgenerator-react is to install it from npm and build it into your app with Webpack.
```
npm install formgenerator-react
```

Then use if in your app:

#### With React Component

```js
import { Card, CardBody, CardHeader } from 'reactstrap';
import { FormGenerator } from 'formgenerator-react';

function App() {

  const fields = {
    username: {
      type: 'text',
      label: 'Username',
      name: 'username',
      col: 6,
      className: 'userinput'
    },
    email: {
      type: 'email',
      label: 'Email',
      name: 'email',
      col: 6
    },
    password: {
      type: 'password',
      label: 'Password',
      name: 'password',
      col: 6
    },
    role: {
      type: 'advanceSelect',
      label: 'Role',
      name: 'role',
      options: [
        {
          value: 'admin',
          label: 'Admin'
        },
        {
          value: 'customer',
          label: 'Customer'
        }
      ],
      col: 6
    },
    product: {
      type: 'advanceSelect',
      label: 'Product',
      name: 'product',
      target: 'http://localhost:5000/products',
      optionValue: 'id',
      optionLabel: 'name',
      multi: false,
      col: 6
    },
    file: {
      type: 'file',
      label: 'Image',
      name: 'file',
      col: 6
    },
    active: {
      type: 'switch',
      label: 'Active',
      name: 'active'
    },
    educationSection: {
    label: 'Education',
    type: 'section',
    name: 'educationSection',
    show: false,
    fields: {
      school: {
        type: 'text',
        label: 'Name of School/College',
        name: 'school',
        col: 12
      }
    }
  }
  }

  return (
    <div className='row w-100 vh-90 pt-5'>
      <div className='col-10 mx-auto'>
        <Card>
          <CardHeader>
            <strong>Add User</strong>
          </CardHeader>
          <CardBody>
            <FormGenerator 
              fields={fields}
              idKey='_id'
              apiUrl='http://localhost:5000' 
              entity='users'
              showToast={true}
              submitCb={data => console.log('form submitted', data)}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
```
### Props

Common props you may want to specify include:

- `idKey` - id key name which is used in your database, for MongoDB it is generally _id
- `apiUrl` - your base api url
- `fields` - object of fields which will generate form
- `entity` - endpoint entity
- `targetId` - record id for edit case
- `submitCb` - callback function which will trigger after success submit of form
- `showToast` - to display default toast
- `formClassName` - class for form
- `btnClassName` - class for form button

If you like FormGenerator-React, please give it a star!
