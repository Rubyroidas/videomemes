import * as amplitude from '@amplitude/analytics-browser';

import {consoleLog} from '../utils';

export enum AnalyticsEvent {
    DownloadButtonClicked = 'download_button_clicked',
    EditFragment_VideoPreviewClicked = 'edit_fragment_video_preview_clicked',
    EditFragment_SwitchImageMode = 'edit_fragment_switch_image_mode',
    EditFragment_IndexChanged = 'edit_fragment_index_changed',
    GenerateVideo_Started = 'generate_video_started',
    GenerateVideo_UserAborted = 'generate_video_user_aborted',
    GenerateVideo_Finished = 'generate_video_finished',
    GenerateVideo_ConsentDialog_Shown = 'generate_video_consent_dialog_shown',
    GenerateVideo_ConsentDialog_Result = 'generate_video_consent_dialog_result',
    Scenario_OpenedCollection = 'scenario_opened_collection',
    Scenario_AddedItem = 'scenario_item_added',
    Scenario_ChangedFormat = 'scenario_changed_format',
    Scenario_DeletedItem = 'scenario_deleted_item',
    Scenario_DraggedItem = 'scenario_dragged_item',
    Preset_Selected = 'preset_selected',
    Language_Changed = 'language_changed',
    FeedItem_VideoViewClicked = 'feed_item_video_view_clicked',
    FeedItem_ConfigReused = 'feed_item_config_reused',
    SnapshotPreview_VideoPlayed = 'snapshot_preview_video_played',
}

if (!__DEV__) {
    amplitude.init('2232c1e3d7a0f750d9304f61d86c1ef9', {
        appVersion: __VER__,
        defaultTracking: {
            sessions: true,
            pageViews: true,
            attribution: true,
            formInteractions: false,
            fileDownloads: true,
        },
    });
}

export const sendAnalyticsEvent = (event: AnalyticsEvent, data: Record<Lowercase<string>, any> = {}) => {
    const page = window.location.pathname;
    const eventParams: Record<Lowercase<string>, any> = {
        page,
        ...data,
    };
    consoleLog(`%cANALYTICS %c${event}`, 'color:yellow', 'color:lightblue', eventParams);
    if (!__DEV__) {
        amplitude.track(event, eventParams);
    }
};
