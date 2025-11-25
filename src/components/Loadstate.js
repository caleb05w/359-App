import React, { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import global from "../globalStyles"

export default function LoadState({ message }) {

    const messagePlaceholder = message ?? "Loading"
    return (
        <View style={[styles.wrapper]}>
            <View style={[styles.absolute]} />
            <View style={[styles.container]}>
                <Text>
                    {messagePlaceholder}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "black",
        opacity: 0.4,
        zIndex: 50,
    },

    container: {
        width: 200,
        height: 200,
        backgroundColor: "white",
        zIndex: 100,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
    }
})