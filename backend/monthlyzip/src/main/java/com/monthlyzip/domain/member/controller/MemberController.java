package com.monthlyzip.domain.member.controller;

import com.monthlyzip.domain.auth.dto.CustomUserDetails;
import com.monthlyzip.domain.member.dto.request.UpdatePasswordRequest;
import com.monthlyzip.domain.member.dto.response.MemberResponse;
import com.monthlyzip.domain.member.dto.response.ProfileImageResponseDto;
import com.monthlyzip.domain.member.service.MemberService;
import com.monthlyzip.global.common.model.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Slf4j
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // 회원정보 조회
    @GetMapping("/me")
    public ApiResponse<MemberResponse> getMemberInfo(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long memberId = userDetails.getMember().getId();
        log.info("회원 정보 조회");
        return ApiResponse.success(memberService.getMemberInfo(memberId));
    }

    // 비밀번호 변경
    @PatchMapping("/password")
    public ApiResponse<Void> updatePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdatePasswordRequest request) {
        System.out.println("pw : " + request.getPassword() + " cpw " + request.getConfirmPassword());
        memberService.updatePassword(userDetails.getMember().getId(), request.getPassword(), request.getConfirmPassword());
        log.info("비밀번호 변경 완료");
        return ApiResponse.success();
    }

    // 이미지 업데이트
    @PutMapping("/profile-image")
    public ApiResponse<ProfileImageResponseDto> updateProfileImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestPart("image") MultipartFile image) {

        String imageUrl = memberService.updateProfileImage(userDetails.getMember().getId(), image);
        log.info("이미지 업데이트 완료: {}", imageUrl);
        return ApiResponse.success(new ProfileImageResponseDto(imageUrl));
    }

    // 회원 탈퇴
    @DeleteMapping
    public ApiResponse<Void> deleteMember(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestHeader("Authorization") String authorizationHeader) {
        Long memberId = userDetails.getMember().getId();
        String accessToken = authorizationHeader.replace("Bearer ", "");

        memberService.deleteMember(memberId, accessToken);
        log.info("회원 탈퇴 완료");
        return ApiResponse.success();
    }
}
