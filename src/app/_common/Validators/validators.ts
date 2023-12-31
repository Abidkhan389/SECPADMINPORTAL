import { FormGroup, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { DateLimits } from "../enum";
import { Helpers } from "../_helper/app_helper";



export function MatchPassword(password: string, confirmPassword: string) {
    return (group: FormGroup) => {
        let passwordInput = group.controls[password],
            passwordConfirmationInput = group.controls[confirmPassword];
        if (passwordInput.value && passwordInput.value !== passwordConfirmationInput.value) {
            return passwordConfirmationInput.setErrors({ notEquivalent: true })
        }
        else {
            return passwordConfirmationInput.setErrors(null);
        }
    }
}

export function compareTwoDates(startDate: string, endDate: string) {
    return (group: FormGroup) => {
        let startDateControl = group.controls[startDate];
        let endDateControl = group.controls[endDate];
        let startVal = Helpers.ngbDateStructToDate(startDateControl.value);
        let endVal = Helpers.ngbDateStructToDate(endDateControl.value);
        if (startVal && endVal) {
            if (startVal > endVal) {
                return endDateControl.setErrors({ dateComparison: true });
            }
            else {
                return endDateControl.setErrors(null);
            }
        }

    }
}

export function compareTime(startTimeCtrl: string, endTimeCtrl: string) {
    return (group: FormGroup) => {
        let startTime = group.controls[startTimeCtrl];
        let endTime = group.controls[endTimeCtrl];
        if (startTime.value && endTime.value) {
            if (startTime.value > endTime.value) {
                return startTime.setErrors({ timeValid: true });
            }
            else {
                return startTime.setErrors(null);
            }
        }
    }
}


export function checkGreaterValues(ctrlOne: string, ctrlTwo: string) {
    return (group: FormGroup) => {
        let ctrlOneControl = group.controls[ctrlOne];
        let ctrlTwoControl = group.controls[ctrlTwo];
        let valueOne = parseFloat(ctrlOneControl.value);
        let valueTwo = parseFloat(ctrlTwoControl.value);
        if (valueOne && valueTwo) {
            if (valueTwo > valueOne) {
                return ctrlTwoControl.setErrors({ compareValue: true });
            }
            else {
                return ctrlTwoControl.setErrors(null);
            }
        }

    }
}

export function NoWhitespaceValidator(control: FormControl) {
    if (control.value && typeof control.value == 'string') {
        if ((control.value || '').trim().length === 0 && control.value.length !== 0) {
            return {
                whitespace: true
            };
        }
    }
    return null;
}

export function SelectRequiredValidator(control: FormControl) {
    if (!(control.value) || control.value == 'null') {
        return {
            required: true
        };
    }
    return null;
}

export function validateDate(minDate, maxDate) {

    return (control: FormControl) => {
        let pipe = new DatePipe('en-US');
        var value = null;
        if (control.value) {
            let d = new Date(control.value.year, control.value.month + 1, control.value.day);
            value = control.value.day + '/' + control.value.month + '/' + control.value.year
        }
        var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        var check = false;
        if (re.test(value)) {
            var adata = value.split('/');
            var mm = parseInt(adata[1], 10);
            var dd = parseInt(adata[0], 10);
            var yyyy = parseInt(adata[2], 10);
            var xdata = new Date(yyyy, mm - 1, dd);
            var mnData = Helpers.ngbDateStructToDate(minDate);
            var mxDate = Helpers.ngbDateStructToDate(maxDate);
            if ((xdata.getFullYear() == yyyy) && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd))
                if (xdata <= mxDate && xdata >= mnData)
                    check = true;
                else
                    check = false;
        }

        return !check && value ? { 'dateValid': true } : null;
    }
}


export function conditionalValidator(condition: (() => boolean), validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (!condition()) {
            return null;
        }
        return validator(control);
    }

    // return (control: AbstractControl): { [key: string]: boolean } | null => {
    //     if (control.value !== undefined && (isNaN(control.value) )) {
    //         return { 'ageRange': true };
    //     }
    //     return null;
    // };

}


