import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, LAYOUT, TAB_CATEGORIES } from '../../constants/theme';

interface TabBarProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {TAB_CATEGORIES.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => onTabPress(tab.id)}>
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.name}
            </Text>
            {activeTab === tab.id && <View style={styles.indicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: LAYOUT.tabHeight,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBackground,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.md,
    minHeight: LAYOUT.touchTargetSize,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    // Active tab styling handled by indicator
  },
  tabText: {
    fontSize: TYPOGRAPHY.bodySize,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.accent.blue,
    borderRadius: 1,
  },
});
