import { ApiProperty } from "@nestjs/swagger";

export class CreateMedicalDto {
    @ApiProperty()
    query: string;
    @ApiProperty()
    answer: string;

}


// model MedicalQuery {
//     id        Int         @id @default(autoincrement())
//     query     String      @db.Text
//     response  String      @db.Text
//     createdAt DateTime    @default(now())
//     updatedAt DateTime    @updatedAt
//   }