# React Native Form Validation

## Overview

Simple JS component for validating forms. Works with deep nested objects.

## Components
### 1. Form
Simple View component.

#### Methods:


1. `validate`

	Validates form. Returns array of objects. Each object is for each `FormItem` in `Form`. Each object has a `isValid` property.
	If form was validated successfully - `submit` callback will be fired. 
	```
	let validatedFields = this.refs.form.validate();
	validatedFields = [
		{
			isValid: true,
			...other props
		},
		{
			isValid: false,
			...other props
		}
	]

	```

#### Props:

| Name           | Type     | Description  |
| ---------------|:--------:|:------------:|
| shouldValidate | boolean  | Describes should form be validated before calling submit function. If form is not valid - submit function not called. `false` by default |
| submit         | function |   Simple callback. Will be fired if form is valid or validation is not required |
| style          | object   |    Simple style object. |

### 2. FormItem
Simple View component. Each `Form` children should be wrapped in `FormItem`.

#### Props:

| Name           | Type     | Description  |
| ---------------|:--------:|:------------:|
| isRequired | boolean  | Describes should this `FormItem` be validated. `false` by default |
| regExp         | object |   Regular expression for validation. `null` by default |
| fieldToBeValidated          | string   |    Name of the property by which we should validate `FormItem`. `'value'` by default |	
| validationFunction          | function   |  Custom validation function. Should return `boolean`. NOTICE! If validationFunction is defined - default validation for empty value and regular expression with `regExp` property will not be called |
| style          | object   |    Simple style object. |


## Example

```javascript
import { Form, FormItem } from 'react-native-form-validation';

class ComponentWithValue extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <View style={this.props.style}>
        <TextInput 
        	style={styles.flex} 
        	value={this.props.value} 
        	onChange={this.props.onChange}/>
      </View>
    )
  }

}


class FormTest extends Component {
  constructor(props){
    super(props);

    this.state = {
      textInput1:'1',
      textInput2:'2',
      textInput3:'3',
      textInput4:'4',
      view1:'1'
    };
  }

  textInput1Change(event){
    this.setState({
      textInput1:event.nativeEvent.text
    })
  }

  textInput2Change(event){
    this.setState({
      textInput2:event.nativeEvent.text
    })
  }

  textInput3Change(event){
    this.setState({
      textInput3:event.nativeEvent.text
    })
  }

  textInput4Change(event){
    this.setState({
      textInput4:event.nativeEvent.text
    })
  }

  submit(){
    let submitResults = this.refs.form.validate();
  }

  customValidation(){
  	return true;
  }

  render(){
    return (
      <View style={styles.container}>
        <Form 
          ref="form" 
          shouldValidate={true} 
          style={styles.flex}>
          <FormItem 
            isRequired={true} 
            regExp={/^\d+$/}
            style={styles.formInput}>
            <TextInput 
              style={styles.firstInput}
              value={this.state.textInput1} 
              onChange={this.textInput1Change.bind(this)}/>
          </FormItem>

          <FormItem 
            isRequired={false}
            style={styles.formInput}>
            <View style={styles.flex}>
              <View 
                style={styles.secondInputWrapper}>
                <TextInput 
                  style={styles.flex} 
                  value={this.state.textInput2} 
                  onChange={this.textInput2Change.bind(this)}/>
              </View>
            </View>
          </FormItem>

          <FormItem
            isRequired={true}
            validationFunction={this.customValidation.bind(this)}>
            <View style={styles.formItem}>
              <View style={styles.flex}>
                <View style={styles.flex}>
                  <TextInput 
                    style={styles.flex} 
                    value={this.state.textInput3} 
                    onChange={this.textInput3Change.bind(this)}/>
                </View>
                <View />
              </View>
            </View>
          </FormItem>

          <FormItem isRequired={true}>
            <ComponentWithValue 
              style={styles.formItem}
              value={this.state.textInput4} 
              onChange={this.textInput4Change.bind(this)}/>
          </FormItem>

          <FormItem 
            isRequired={true}
            fieldToBeValidated={'test'}>
            <View 
              style={styles.formItem}
              test={this.state.view1}>
              <Text> {this.state.view1}</Text>
            </View>
          </FormItem>
        </Form>

        <TouchableOpacity onPress={this.submit.bind(this)}>
          <View style={styles.submitBtn}>
            <Text>Submit</Text>
          </View>
        </TouchableOpacity>

      </View>
    )
  }
}

export default class SmartForm extends Component {
  render() {
    return (
        <FormTest />
    );
  }
}

```

## License

MIT
