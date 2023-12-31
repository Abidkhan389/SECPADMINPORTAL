export enum AuditTypeEnum {
    LoginSuccess = "LoginSuccess",
    LoginFailure = "LoginFailure",
    Logout = "Logout",
    ResetPassword = "ResetPassword",
    TwoFactorSetting = "TwoFactorAuth",
  }
  export enum DateLimits {
    MinDOB = 70,
    MaxDOB = 18,
    MinAvailableDOB = 0,
    MaxAvailableDOB = -1,
  }
  
  
  
  export enum DeviceTypeEnum {
    Desktop = "Desktop",
    Tablet = "Tablet",
    Mobile = "Mobile",
  }
  export enum MediumEnum {
    Email = "Email",
    SMS = "SMS",
  }
  
  export enum EnquiryStatusEnum {
    New = "New",
    Open = "Open",
    Closed = "Closed",
    Replied = "Replied",
    RepliedByCall = "EnquiryRepliedByCall",
  }
  
  export enum StatusEnum {
    Active = 1,
    InActive = 0,
    Locked = 2,
    Deleted = -1,
  }
  
  export enum ActiveEnum {
    Active = "Active",
    InActive = "In Active",
  }
  export enum FormStatusEnum {
    Rejected,
    Active,
    Deffered,
    Submitted,
    Approved,
    SaveAsDraft,
    AwaitingApproval,
    Canceled,
  }
  export enum ProcessSteps {
    Cancelation = 0,
    Submission = 1,
    Approval = 2,
  }
  
  export enum HeadType {
    Fee = 0,
    Manual = 1,
  }
  
  export enum HeadTypeFixed {
    Fee = 0,
    Exemption = 1,
  }
  
  export enum GuardianType {
    Mother = "Mother",
    Father = "Father",
    Guardian = "Guardian",
  }
  
  export const admissionSteps = {
    childInfo: 'childInfo',
    guardianInfo: 'guardianInfo',
    academicInfo: 'academicInfo',
    admissionConfirmation: 'admissionConfirmation',
    admittanceInfo: 'admittanceInfo'
  }
  
  export const enrollSteps = {
    studentInfo: 'studentInfo',
    parentInfo: 'parentInfo',
    academicProfile: 'academicProfile',
  }
  
  export enum ApproveObjectionEnum {
    Pending = 0,
    Approved = 1,
    Objected = 2,
    AwaitingApproval = 3,
    ReinstateRequested = 4,
    ReinstateApproved = 5,
    Enqueue = 6,
  }
  export enum CalendarEnum {
    Activity = "Activity",
    LessonPlan = "LessonPlan",
    Holiday = "Holiday",
  }
  
  export enum EnrollStatusEnum {
    Active = 1,
    InActive = 2,
    CampusTransferRequested = 12,
    PromotionRequested = 22,
    CampusTransfered = 52,
    ClassTrasnferRequested = 32,
    ClassTrasnferObjected = 42,
    WithdrawalReqested = 4,
    WithdrawalObjected = 5,
    Withdraw = 6,
    GraduationRequested = 7,
    GraduationObjected = 8,
    Graduated = 9,
  }
  
  export enum AttendanceEnum {
    Absent = "Absent",
    Leave = "Leave",
    Present = "Present",
    NotMarked = "NotMarked",
  }
  
  export enum AttendanceApprovalStatus {
    Approved = 1,
    Pending = 0,
    NotMarked = 2,
    Marked = 3
  }
  
  export enum QuestionLevel {
    Easy = 1,
    Medium = 2,
    Difficult = 3,
  }
  
  export enum QuestionType {
    TrueFalse = 0,
    MCQ = 1,
    ShortQuestion = 2,
    LongQuestion = 3,
  
  }
  
  
  export enum QuestionMapType {
    TrueFalse = 0,
    MCQ = 1,
    ShortQuestion = 2,
    LongQuestion = 3,
    Videos = 7
  }
  
  export enum LanguageType {
    English = 0,
    Math = 1,
    Urdu = 2,
  }
  
  export enum ExamApprovalEnum {
    SaveAsDraft = 0,
    Approved = 1,
    Submitted = 2,
    NotMark = 3,
    DateExpire = 4,
    Objected = 5,
  }
  
  export enum ConcessionTypes {
    Concession = 0,
    Scholarship = 1,
    Sibling = 2
  }
  
  export enum markResultStatus {
    NotMarked = 0,
    Marked = 1,
    PartiallyMarked = 2,
    Submitted = 3,
    Approved = 4
  }
  
  export enum TrainingType {
    ECE = 'ECE',
    Primary = 'Primary',
    Middle = 'Middle',
    GradesSubject = 'Grades Subject',
  
  }
  
  
  export enum educationType {
    Formal = 'Formal',
    Nonformal = 'Non-formal'
  }