import { ApiProperty } from "@nestjs/swagger";
import { OrderItem } from "../interface/orderitems.interface";

export class SuccessResponse {
    @ApiProperty({ example: true })
    success: boolean;
  }
  
  export class UnauthorizedResponse {
    @ApiProperty({ example: 'Bạn không có quyền xóa đơn hàng này' })
    message: string;
  }
  
  export class NotFoundResponse {
    @ApiProperty({ example: 'Không tìm thấy đơn hàng với id tương ứng' })
    message: string;
  }
  
  export class InternalServerErrorResponse {
    @ApiProperty({ example: 'Lỗi nội bộ server' })
    message: string;
  }

