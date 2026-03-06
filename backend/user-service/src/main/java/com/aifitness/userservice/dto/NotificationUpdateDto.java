package com.aifitness.userservice.dto;

public class NotificationUpdateDto {
    private Boolean notificationWorkout;
    private Boolean notificationDiet;
    private Boolean notificationAi;
    private Boolean notificationMarketing;

    public Boolean getNotificationWorkout() {
        return notificationWorkout;
    }

    public void setNotificationWorkout(Boolean notificationWorkout) {
        this.notificationWorkout = notificationWorkout;
    }

    public Boolean getNotificationDiet() {
        return notificationDiet;
    }

    public void setNotificationDiet(Boolean notificationDiet) {
        this.notificationDiet = notificationDiet;
    }

    public Boolean getNotificationAi() {
        return notificationAi;
    }

    public void setNotificationAi(Boolean notificationAi) {
        this.notificationAi = notificationAi;
    }

    public Boolean getNotificationMarketing() {
        return notificationMarketing;
    }

    public void setNotificationMarketing(Boolean notificationMarketing) {
        this.notificationMarketing = notificationMarketing;
    }
}
