import { select } from "@angular-redux/store";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LookupService } from "src/app/_services/lookup.service";
import { ResultMessages } from "../constant";
import { showErrorMessage, showInfoMessage } from "../messages";

export class DropDownUtils {
    permissions: any = {}
    @select('config') public config$: Observable<any>;
    checkPermissions: any[] = [];
    loading: boolean;
    constructor(protected lookupService: LookupService,
        protected router: Router) {

    }

    protected getAllCoursesForDDL(callback: (data) => void) {
        this.lookupService.getAllCoursesForDDL()
            .subscribe(
                result => {
                    if (result)
                        callback(result);
                },
                error => {
                    showErrorMessage(ResultMessages.serverError)
                });
    }
    protected GetAllCategory(callback: (data) => void) {
        this.lookupService.getAllCategoriesForCourses()
            .subscribe(
                result => {
                    if (result)
                        callback(result);
                },
                error => {
                    showErrorMessage(ResultMessages.serverError)
                });
    }

    protected getAllLecturesDDLByCourseId(val,callback: (data) => void) {
        this.lookupService.GetAllLecturesByCourseId(val)
            .subscribe(
                result => {
                    if (result)
                    {   
                        callback(result);
                    }
                    // else{
                    //     callback(0);
                    // }
                },
                error => {
                    showErrorMessage(ResultMessages.serverError)
                });
    }
}