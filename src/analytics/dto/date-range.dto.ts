import { IsDate } from "class-validator";

export class DateRangeDto {

    @IsDate()
    startDate: Date;

    @IsDate()
    endDate: Date;

}