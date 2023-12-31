import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DashboardService } from 'src/app/_services/administration/dashboard.service';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  loading:boolean=true;
  dashboarddata:any;
  allCourses:any;
  coursenamewithId:any;
  public barChartOptionsCourses: any; // Initialize as undefined
  public barChartLabels: string[] =[];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartData: number[] = [0,10,20,100,200];
  public barChartcourseData: number[] = [0,10,20,100,200];
  // For users
  public barChartOptionsForUsers: any; // Initialize as undefined
  public barChartLabelsforUsers: any; // Initialize as undefined

  constructor(private dashboardService:DashboardService) { }

  ngOnInit(): void {
    this.getDashboardData();
  }
  getDashboardData(){
    this.loading = true;
     this.dashboardService.GetDashBoardData()
      .pipe(
        finalize(() => {
          this.loading = false;
        }))
      .subscribe(result => {
        if (result) {
          this.dashboarddata=result;
          //this.barChartLabels = this.dashboarddata.allCourses.map(course => course.courseName);
          this.barChartLabelsforUsers=this.dashboarddata.userPerCourseCount.map(user=> user.userName);
          const enrollmentCountsMap = {};
          this.dashboarddata.courseUserCountdetails.forEach(course => {
            enrollmentCountsMap[course.courseId] = course.enrollmentCount;
          });
          this.allCourses=this.dashboarddata.allCourses;
          // Now, you can map enrollmentCount to allCourses
          this.allCourses.forEach(course => {
            const matchingEnrollmentCount = enrollmentCountsMap[course.courseId];
            if (matchingEnrollmentCount !== undefined) {
              course.enrollmentCount = matchingEnrollmentCount;
            } else {
              // Handle the case where there is no matching enrollment count, set to 0 or some default value.
              course.enrollmentCount = 0; // Default to 0 if not found
            }
          });
          this.barChartLabels = this.allCourses.map(course => course.courseName);
          this.barChartcourseData=this.allCourses.map(course=> course.enrollmentCount);
          this.barChartData=this.dashboarddata.userPerCourseCount.map(user=> user.enrollmentCount);
          this.initializeBarChartOptions(); // Call the method to set barChartOptions
        }
      });
  }
   initializeBarChartOptions() {
    debugger
    // Create barChartOptions based on dashboarddata
    this.barChartOptionsCourses = {
      scales: {
        xAxes: [
          {
            ticks: {
              maxRotation: 90,
              minRotation: 0,
            },
          },
        ],
      },
    };
    this.barChartOptionsForUsers = {
      scales: {
        xAxes: [
          {
            ticks: {
              maxRotation: 90,
              minRotation: 0,
            },
          },
        ],
      },
      // tooltips: {
      //   callbacks: {
      //     label: (tooltipItem, data) => {
      //       debugger
      //       const userId = this.dashboarddata.userPerCourseCount[tooltipItem.index].userId;
      //       const userName = this.dashboarddata.userPerCourseCount[tooltipItem.index].userName;
      //       const userCountData = this.dashboarddata.userPerCourseCount.find(data => data.userId === userId);
      //       const enrollmentCount = userCountData ? userCountData.enrollmentCount : 0;
      //       // Calculate the chart height for the current course individually
      //       //this.chartHeight = (enrollmentCount / this.dashboarddata.enrolledUserCount) * 400; // Adjust the maximum height as needed
      //       // Assign the height to the chart container
      //       //document.querySelector('.chart-container').style.height = courseChartHeight + 'px';

      //       //return `${userName}: Courses ${enrollmentCount}`;
      //       return `Courses ${enrollmentCount}`;
      //     },
      //   },
      // },
    };
   }

}
