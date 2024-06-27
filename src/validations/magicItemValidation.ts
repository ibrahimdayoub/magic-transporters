import Validator from 'validatorjs';

export const addMagicItemValidator = (data: any) => {
    const rules = {
        name: 'required|string',
        weight: 'required|integer'
    };

    return new Validator(data, rules);
}