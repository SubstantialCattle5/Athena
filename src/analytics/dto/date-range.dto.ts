import { IsDate, IsNumber, IsString } from "class-validator";

export class DateRangeDto {

    @IsDate()
    startDate: Date;

    @IsDate()
    endDate: Date;

}