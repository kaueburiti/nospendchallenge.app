import { PostHogProvider } from "posthog-react-native";
import { Children, PropsWithChildren } from "react";

export const ConditionalPostHogProvider = ({children}: PropsWithChildren) => {

    if (process.env.EXPO_PUBLIC_POSTHOG_API_KEY && process.env.EXPO_PUBLIC_POSTHOG_HOST) {
        return (
            <PostHogProvider
                apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY}
                options={{
                host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
                }}
          >
            {children}
          </PostHogProvider>
        )
    }

    return <>{children}</>
}