package com.infilasyon.infinexchangebackend.dto.response;

import com.infilasyon.infinexchangebackend.entity.enums.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class UserResponse {
    private Integer id;
    private String username;
    private String firstName;
    private String lastName;
    private Role role;
    private String email;
    private Date createdDate;
}
