import React from 'react';
import CreateBondForm from '../../../src/components/CreateBondForm';
import { Redirect } from 'react-router';

let fetch = global.fetch;

const mockFetch = () => {
  global.fetch = jasmine.createSpy('fetch').and.returnValue(
    new Promise(resolve => {
      resolve({
        ok: true,
        json: () =>
          new Promise(resolve => {
            resolve({
              fixed_membership_fee: true,
              fixed_membership_fee_amount: 123
            });
          })
      });
    })
  );
};

const restoreFetch = () => {
  global.fetch = fetch;
};

const VALID_RENT = '45674';
const VALID_POSTCODE = 'E8 2RG';
const INVALID_POSTCODE = '39RU4N';

const inputPostcode = (wrapper, postcode) => {
  wrapper.find('.bond-form__postcode').simulate('change', {
    preventDefault: () => {},
    target: { id: 'postcode', value: postcode }
  });
};
const inputRent = (wrapper, rent) => {
  wrapper.find('.bond-form__rent').simulate('change', {
    preventDefault: () => {},
    target: { id: 'rentAmount', value: rent }
  });
};

describe('<CreateBondForm />', () => {
  beforeEach(() => {
    mockFetch();
  });
  afterAll(() => {
    restoreFetch();
  });
  test('SHOULD render form', () => {
    const wrapper = shallow(<CreateBondForm />);
    expect(wrapper).toMatchSnapshot();
  });
  describe('GIVEN the user has entered one valid input', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<CreateBondForm />);
      inputPostcode(wrapper, VALID_POSTCODE);
    });
    test('SHOULD set correct state', () => {
      expect(wrapper.state('postcode')).toEqual({
        isValid: true,
        postcodeValue: VALID_POSTCODE
      });
      expect(wrapper.state('isFormComplete')).toBe(false);
    });
  });
  describe('GIVEN the user has entered an invalid input', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<CreateBondForm />);
      inputPostcode(wrapper, INVALID_POSTCODE);
    });
    test('SHOULD set correct state', () => {
      expect(wrapper.state('psotcode')).toEqual({
        postcodeValue: INVALID_POSTCODE,
        isValid: false
      });
    });
  });
  describe('GIVEN the user has entered all valid inputs', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<CreateBondForm />);
      inputPostcode(wrapper, VALID_POSTCODE);
      inputRent(wrapper, VALID_RENT);
    });
    test('SHOULD set correct state', () => {
      expect(wrapper.state('postcode')).toEqual(VALID_POSTCODE);
      expect(wrapper.state('rentAmount')).toEqual(VALID_RENT);
      expect(wrapper.state('invalidInputs')).toEqual([]);
      expect(wrapper.state('isFormComplete')).toBe(true);
    });
  });
  describe('GIVEN the form has been been submitted', () => {
    test('SHOULD redirect to Confirmation', () => {
      const wrapper = shallow(<CreateBondForm />);
      wrapper.setState({ isFormSubmitted: true });
      expect(wrapper.find('.bond-form').exists()).toBe(false);
      expect(wrapper.find(Redirect).exists()).toBe(true);
    });
  });
});
