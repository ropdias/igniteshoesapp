import { OneSignal } from "react-native-onesignal";

export function tagUserInfoCreate() {
    OneSignal.User.addTags({
        user_name: "Rodrigo",
        user_email: "rodrigopdias.dev@gmail.com",
    });
}

export function tagUserInfoDelete() {
    OneSignal.User.removeTags(["user_name", "user_email"]);
}