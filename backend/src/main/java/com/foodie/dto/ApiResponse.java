package com.foodie.dto;
public class ApiResponse<T> {
    private String message; private T data; private boolean success;
    public ApiResponse() {}
    public ApiResponse(String m, T d, boolean s) { message=m; data=d; success=s; }
    public static <T> ApiResponse<T> ok(String m, T d) { return new ApiResponse<>(m,d,true); }
    public static <T> ApiResponse<T> error(String m) { return new ApiResponse<>(m,null,false); }
    public String getMessage() { return message; } public void setMessage(String v) { message=v; }
    public T getData() { return data; } public void setData(T v) { data=v; }
    public boolean isSuccess() { return success; } public void setSuccess(boolean v) { success=v; }
}
