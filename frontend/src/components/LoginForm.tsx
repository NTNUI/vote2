import React from "react";
import {
	Button,
	createStyles,
	Input,
	PasswordInput,
	Select,
	TextInput,
    Notification,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/auth";
import countryCodes from "../utils/countryCodes";
import NtnuiInfoTooltip from './Tooltip'
import { ChevronDown, Lock, Phone, World, X } from 'tabler-icons-react'

const useStyles = createStyles((theme) => ({
    phoneNumberWrapper: {
		width: '100%',
		marginBottom: '1rem',
		display: 'grid',
		gridTemplateColumns: '0.8fr 1.2fr',
		gridTemplateRows: '1fr auto',
		gridTemplateAreas: `
        "label label"
        "country_code phone_number"
        `,
		label: {
			gridArea: 'label',
			alignSelf: 'center',
			color: 'white',
			display: 'flex',
			alignItems: 'center',
			marginBottom: '5px',
		},
	},
	selectCountryCodeInput: {
		color: 'white',
		'.mantine-Select-rightSection': { pointerEvents: 'none' },
		input: {
			gridArea: 'country_code',
			backgroundColor: 'transparent',
			borderRadius: '5px 5px 0 5px',
			color: 'white',
			width: '100%',
			transition: '0.3s',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
		},
	},
	numberInput: {
		input: {
			gridArea: 'phone_number',
			backgroundColor: 'transparent',
			color: 'white',
			borderRadius: '5px 5px 0px 5px',
			width: '100%',
		},
		'.mantine-TextInput-error': {
			margin: 0,
			position: 'absolute',
		},
	},
	passwordInput: {
		label: {
			color: 'white',
			display: 'flex',
			alignItems: 'center',
			marginBottom: '5px',
			span: {
				display: 'none',
			},
		},
		width: '100%',
		marginBottom: '10px',
		input: {
			backgroundColor: theme.colors.ntnui_background[9],
			color: 'white',
		},
	},
	submitButton: {
		transition: '0.3s',
		width: '100%',
		margin: '1rem 0 0.5rem 0',
		backgroundColor: theme.colors.ntnui_blue[9],
		border: '2px solid' + theme.colors.ntnui_blue[9],
		':hover': {
			border: '2px solid' + theme.colors.ntnui_blue[9],
			color: theme.colors.ntnui_blue[9],
			backgroundColor: 'transparent',
		},
	},
	link: {
		textDecoration: 'none',
		color: theme.colors.ntnui_blue[9],
	},

	loginErrorRoot: {
		backgroundColor: theme.colors.ntnui_background[9],
		borderColor: theme.colors.ntnui_red[9],
	},
	loginErrorText: {
		color: 'white',
	},
	form: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		color: 'white',
	},

}))

export function LoginForm() {
  const { classes } = useStyles()
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  type FormValues = {
    country_code: string;
    phone_number: string;
    password: string;
  };

  type CountryCodePair = {
    land: string;
    kode: string;
  };

  const form = useForm({
    initialValues: {
      country_code: "47",
      phone_number: "",
      password: "",
    },

    validate: {
      phone_number: (value) =>
        !/^[0-9]{8,}$/.test(value) ? "Unvalid format" : null,
    },
  });

  const submitLoginForm = (values: FormValues) => {
    setIsLoading(true);
    const credentials = {
      phone_number: "+" + values.country_code + values.phone_number,
      password: values.password,
    };
    try {
      login(credentials.phone_number, credentials.password)
        .then(() => {
          setIsLoading(false);
          navigate("/dashboard");
        })
        .catch(() => {
          setIsLoading(false);
          setError(true);
        });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const countryCodesToSelect = countryCodes.map((code: CountryCodePair) => {
    return {
      key: code.land,
      value: code.kode,
      label: `(+${code.kode}) ${code.land}`,
    };
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => submitLoginForm(values))}
      className={classes.form}
    >
      <Input.Wrapper
        label={
          <>
            PHONE
            {NtnuiInfoTooltip(
              <>
                Log in with the same phone number you use at{" "}
                <a
                  className={classes.link}
                  href="https://medlem.ntnui.no/login"
                >
                  medlem.ntnui.no
                </a>
              </>
            )}
          </>
        }
        className={classes.phoneNumberWrapper}
      >
        <Select
          required
          aria-label="Choose country code"
          data={countryCodesToSelect}
          rightSection={<ChevronDown size={20} />}
          rightSectionWidth={30}
          icon={<World size={20} />}
          className={classes.selectCountryCodeInput}
          {...form.getInputProps("country_code")}
        />
        <TextInput
          required
          type="tel"
          placeholder="Phone"
          icon={<Phone size={20} />}
          className={classes.numberInput}
          {...form.getInputProps("phone_number")}
          onBlur={() => form.validateField("phone_number")}
        />
      </Input.Wrapper>
      <PasswordInput
        required
        autoComplete="password"
        label={
          <>
            PASSWORD
            {NtnuiInfoTooltip(
              <p>
                Log in with the same password you use at{" "}
                <a
                  className={classes.link}
                  href="https://medlem.ntnui.no/login"
                >
                  medlem.ntnui.no
                </a>
              </p>
            )}
          </>
        }
        placeholder="Password"
        icon={<Lock size={20} />}
        className={classes.passwordInput}
        {...form.getInputProps("password")}
      />
      {error && (
        <Notification
          title="Could not log in!"
          disallowClose
          classNames={{
            root: classes.loginErrorRoot,
            title: classes.loginErrorText,
            description: classes.loginErrorText,
          }}
          onClose={() => {}}
          icon={<X size={20} />}
          color="red"
        >
          Cannot find any user with this password and username
        </Notification>
      )}
      <Button
        loading={isLoading}
        uppercase
        className={classes.submitButton}
        type="submit"
      >
        Log in
      </Button>
    </form>
  );
}
