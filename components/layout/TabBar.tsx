import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SPACING, TYPOGRAPHY, LAYOUT } from '../../constants/theme';
import { useThemeStore } from '../../store/theme/useThemeStore';
import { useFoldersStore } from '../../store/folders/useFoldersStore';
import { t } from '../../utils/i18n';
import { useLanguage } from '../../utils/useLanguage';

interface TabBarProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabPress }) => {
  useLanguage(); // Forzar re-render en cambio de idioma
  const { colors } = useThemeStore();
  const { folders } = useFoldersStore();

  // Create tabs from folders, including "Todas" as the first option
  const tabs = [
    { id: 'all', name: t('tabs.all') },
    ...folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
    })),
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.cardBackground }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => onTabPress(tab.id)}>
            <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === tab.id && { color: colors.textPrimary }]}>
              {tab.name}
            </Text>
            {activeTab === tab.id && <View style={[styles.indicator, { backgroundColor: colors.accent.blue }]} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: LAYOUT.tabHeight,
    borderBottomWidth: 1,
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
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },
});
