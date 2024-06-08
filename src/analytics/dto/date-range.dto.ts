import { IsDate, IsNumber, IsString } from "class-validator";

export class DateRangeDto {

    @IsNumber()
    startDate: number;

    @IsNumber()
    endDate: number;

}