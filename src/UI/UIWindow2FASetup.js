/*
    Plan:
        Components: OneAtATimeView < ... >

        Screen 1: QR code and entry box for testing
            Components: Flexer < QRCodeView, CodeEntryView, ActionsView >
            Logic:
            - when CodeEntryView has a value, check it against the QR code value...
              ... then go to the next screen
              - CodeEntryView will have callbacks: `verify`, `on_verified`
            - cancel action

        Screen 2: Recovery codes
            Components: Flexer < RecoveryCodesView, ConfirmationsView, ActionsView >
            Logic:
            - done action
            - cancel action
            - when done action is clicked, call /auth/configure-2fa/enable

*/

import CodeEntryView from "./Components/CodeEntryView.js";
import Flexer from "./Components/Flexer.js";
import QRCodeView from "./Components/QRCode.js";
import RecoveryCodesView from "./Components/RecoveryCodesView.js";
import StepHeading from "./Components/StepHeading.js";
import StepView from "./Components/StepView.js";
import StringView from "./Components/StringView.js";
import TestView from "./Components/TestView.js";
import UIAlert from "./UIAlert.js";
import UIComponentWindow from "./UIComponentWindow.js";

const UIWindow2FASetup = async function UIWindow2FASetup () {
    const resp = await fetch(`${api_origin}/auth/configure-2fa/setup`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${puter.authToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    });
    const data = await resp.json();

    const check_code_ = async function check_code_ (value) {
        const resp = await fetch(`${api_origin}/auth/configure-2fa/test`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${puter.authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: value,
            }),
        });

        const data = await resp.json();

        return data.ok;
    };

    let stepper;
    let code_entry;
    const component =
        new StepView({
            _ref: me => stepper = me,
            children: [
                new Flexer({
                    children: [
                        new StepHeading({
                            symbol: '1',
                            text: 'Open Authenticator App',
                        }),
                        new StringView({
                            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ornare augue eu est pharetra, non faucibus eros finibus. Morbi metus sapien, pretium consequat erat eu, accumsan imperdiet metus. Donec varius libero tellus, malesuada rhoncus nunc viverra eget. Quisque ultrices scelerisque ante. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non purus varius, molestie nibh vitae, elementum urna. Suspendisse ultricies porta gravida. Nulla eu consequat mi, id mattis leo.',
                        }),
                        new StepHeading({
                            symbol: '2',
                            text: 'Scan This QR Code',
                        }),
                        new QRCodeView({
                            value: data.url,
                        }),
                        new StepHeading({
                            symbol: '3',
                            text: 'Enter Verification Code',
                        }),
                        new CodeEntryView({
                            _ref: me => code_entry = me,
                            async [`property.value`] (value, { component }) {
                                console.log('value? ', value)

                                if ( false && ! await check_code_(value) ) {
                                    component.set('error', 'Invalid code');
                                    return;
                                }

                                stepper.next();
                            }
                        }),
                    ],
                    ['event.focus'] () {
                        code_entry.focus();
                    }
                }),
                new Flexer({
                    children: [
                        new StepHeading({
                            symbol: '4',
                            text: 'Copy Recovery Codes',
                        }),
                        new StringView({
                            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ornare augue eu est pharetra, non faucibus eros finibus. Morbi metus sapien, pretium consequat erat eu, accumsan imperdiet metus. Donec varius libero tellus, malesuada rhoncus nunc viverra eget. Quisque ultrices scelerisque ante. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non purus varius, molestie nibh vitae, elementum urna. Suspendisse ultricies porta gravida. Nulla eu consequat mi, id mattis leo.',
                        }),
                        new RecoveryCodesView({
                            values: data.codes,
                        }),
                        new StepHeading({
                            symbol: '5',
                            text: 'Confirm Recovery Codes',
                        }),
                    ]
                }),
            ]
        })
        ;

    UIComponentWindow({
        component,
        on_before_exit: async () => {
            console.log('this was called?');
            return await UIAlert({
                message: i18n('cancel_2fa_setup'),
                buttons: [
                    {
                        label: i18n('yes'),
                        value: true,
                        type: 'primary',
                    },
                    {
                        label: i18n('no'),
                        value: false,
                    },
                ]
            });
        },

        title: 'Instant Login!',
        app: 'instant-login',
        single_instance: true,
        icon: null,
        uid: null,
        is_dir: false,
        // has_head: false,
        selectable_body: true,
        // selectable_body: false,
        allow_context_menu: false,
        is_resizable: false,
        is_droppable: false,
        init_center: true,
        allow_native_ctxmenu: false,
        allow_user_select: false,
        // backdrop: true,
        width: 550,
        height: 'auto',
        dominant: true,
        show_in_taskbar: false,
        draggable_body: true,
        onAppend: function(this_window){
        },
        window_class: 'window-qr',
        body_css: {
            width: 'initial',
            height: '100%',
            'background-color': 'rgb(245 247 249)',
            'backdrop-filter': 'blur(3px)',
            padding: '20px',
        },
    });
}

export default UIWindow2FASetup;
