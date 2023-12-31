import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICategory } from 'src/app/interfaces/category/ICategory';
import { CategoryService } from 'src/app/_services/administration/category.service';
import { finalize } from 'rxjs/operators';
import { Messages, NoWhitespaceValidator, Patterns, ResultMessages, showErrorMessage } from 'src/app/_common';
@Component({
  selector: 'app-add-edit-categorie',
  templateUrl: './add-edit-categorie.component.html',
  styleUrls: ['./add-edit-categorie.component.sass']
})
export class AddEditCategorieComponent implements OnInit {
  addEditCategory: ICategory;
  addEditCategoryForm: FormGroup;
  selectedCategoryName: any;
  loading: any;
  validationMessages = Messages.validation_messages;
  constructor(private fb: FormBuilder, private dialogref: MatDialogRef<AddEditCategorieComponent>, public categoryService: CategoryService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.addEditCategory = {} as ICategory;
  }

  ngOnInit(): void {
    //Getting Value from Modal Ref and get by Id
    if (this.data.categoryId) {
      this.GetCategory()
    }
    this.addEditCategoryForm = this.fb.group({
      categoryName: new FormControl('', Validators.compose([NoWhitespaceValidator, Validators.required, Validators.pattern(Patterns.titleRegex), Validators.maxLength(50)])),
    });
  }
  //Getting By ID
  GetCategory() {
    this.loading = true;
    this.categoryService.GetCategoryById(this.data.categoryId).pipe(
      finalize(() => {
        this.loading = false;
      }))
      .subscribe(result => {
        if (result) {
          this.addEditCategoryForm.patchValue(result);
          if (this.data.readOnly) {
            this.addEditCategoryForm.disable()
          }

        }
      },
        error => {
          showErrorMessage(ResultMessages.serverError);
        });
  }
  // on submit button Add or Edit Category
  AddEditSubmit() {
    this.addEditCategory = this.addEditCategoryForm.value;
    if (this.data.categoryId)
      this.addEditCategory.categoryId = this.data.categoryId;
    this.categoryService.addEditCateory(this.addEditCategory).subscribe((data: any) => {
      this.dialogref.close(true);
    });
  }
  //Its Close The DialogRef Modal
  closeClick() {
    this.dialogref.close();
  }

}
