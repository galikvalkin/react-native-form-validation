import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

function checkForm(formItems){
	let requiredFields = findRequiredFields(formItems),
		requiredFieldsValue = findRequiredFieldsProps(requiredFields),
		valuesFilledOut = checkValuesFilledOut(requiredFieldsValue);
	
	return {
		isValid: checkAllFieldsValid(valuesFilledOut),
		fields: valuesFilledOut
	};
}

function checkAllFieldsValid(fields){
	for(var i = 0; i < fields.length; i++){
		if(!fields[i].isValid){
			return false;
		}

	}
	return true;
}

function checkValuesFilledOut(items){
	let localItems = [...items];

	for(var i = 0; i < localItems.length; i++){

		/**
			If field required validation - validate
		**/
		if(localItems[i].requiresValidation){
			let value = localItems[i].props[localItems[i].fieldToBeValidated];

			if(localItems[i].validationFunction){
				localItems[i].isValid = localItems[i].validationFunction(value);
			}
			else{
				let	isNotEmpty = value ? true : false,
					regExpCheck = localItems[i].regExp ? localItems[i].regExp.test(value) : true;

				localItems[i].isValid = isNotEmpty && regExpCheck;
			}
		}
		/**
			Else - it is already valid
		**/
		else{
			localItems[i].isValid = true;
		}
		
		
	}
	return localItems;
}


/**
** simple map. calls recursive function as return statement
**/
function findRequiredFieldsProps(requiredFields){
	return requiredFields.map((item) => {
		return { 
			props: findValueOfChildren(item.value, item.fieldToBeValidated), 
			...item 
		};
	});
}


/**
** find all required fields; look through FormItem component's isRequired property
**/
function findRequiredFields(formItems){
	let requiredFields = [];

	for(var i = 0; i < formItems.length; i++){
		// if(formItems[i].props.isRequired){
			// console.log('formItems[i]: ', formItems[i].props.validationFunction)
			requiredFields.push({
				requiresValidation: formItems[i].props.isRequired,
				value: formItems[i], 
				regExp: formItems[i].props.regExp,
				fieldToBeValidated: formItems[i].props.fieldToBeValidated,
				validationFunction: formItems[i].props.validationFunction
			});
		// }
	}
	
	return requiredFields;
}

// function findRequiredFields(formItems){
// 	let requiredFields = [];

// 	for(var i = 0; i < formItems.length; i++){
// 		if(formItems[i].props.isRequired){
// 			console.log('formItems[i]: ', formItems[i].props.validationFunction)
// 			requiredFields.push({
// 				value: formItems[i], 
// 				regExp: formItems[i].props.regExp,
// 				fieldToBeValidated: formItems[i].props.fieldToBeValidated,
// 				validationFunction: formItems[i].props.validationFunction
// 			});
// 		}
// 	}
	
// 	return requiredFields;
// }

/**
** recursive - we need to cover deep nested items.
**/
function findValueOfChildren(child, fieldToBeValidated){
	if((!child.props.hasOwnProperty(fieldToBeValidated))){
		
		if(child.props.children){

			if(child.props.children.length){

				let arr = child.props.children.map((item) => {
					return findValueOfChildren(item, fieldToBeValidated);
				});

				return findValueInArray(arr);

			}
			else{

				return findValueOfChildren(child.props.children, fieldToBeValidated);

			}

		}

	}
	else{
		return child.props;
	}
}

/**
** reduce array to only one item
**/
function findValueInArray(arr){
	let valueObj = {};
	for(var i = 0; i < arr.length; i++){
		if(arr[i]){
			valueObj = arr[i];
		}
	}

	return valueObj;
}


class FormItem extends Component{
	constructor(props){
		super(props);
	}

	render(){
		let formItemStyles = [styles.formItem, this.props.style ? this.props.style : {}];
		return(
			<View style={formItemStyles}>
				{this.props.children}
			</View>
		)
	}
}

FormItem.propTypes = {
	isRequired: PropTypes.bool,
	regExp: PropTypes.object,
	fieldToBeValidated: PropTypes.string.isRequired,
	validationFunction: PropTypes.func,
	style: PropTypes.any
};

FormItem.defaultProps = {
	isRequired: false,
	regExp: null,
	fieldToBeValidated: 'value',
	validationFunction: null,
	style: {}
};


class Form extends Component{
	constructor(props){
		super(props);
	}

	validate(){
		let validationResults = checkForm(this.props.children);
		const { shouldValidate, submit } = this.props;

		if(shouldValidate){
			console.log('FORM SHOULD BE VALIDATED');

			if(validationResults.isValid){
				console.log('OK. RUN SUBMIT CALLBACK');
				submit();
			}
			else{
				console.log('OOPS. HIGHLIGHT WRONG FIELDS');
			}
		}
		else{
			console.log('FORM SHOULD NOT BE VALIDATED. RUN SUBMIT CALLBACK');
			submit();
		}

		return validationResults.fields;
	}

	render(){
		let formContainerStyles = [styles.formContainer, this.props.style ? this.props.style : {}];
		return(
			<View style={formContainerStyles}>
				{this.props.children}	
			</View>
		);
	}
}

Form.propTypes = {
	shouldValidate: PropTypes.bool,
	submit: PropTypes.func,
	style: PropTypes.any
};

Form.defaultProps = {
	shouldValidate: false,
	submit: () => { console.log('Form - submit function is not defined'); },
	style: {}
}

const styles = {
	formContainer:{},
	formItem:{}
};

export {
	Form as Form,
	FormItem as FormItem
}