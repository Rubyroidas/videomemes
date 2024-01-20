import {Button, Header, LinksList, MinorLink, Paragraph} from './HomePage.styles';

export const HomePage = () => (
    <div>
        <Header>
            Memely.net
        </Header>
        <Paragraph>
            Free service for short funny videos creation
        </Paragraph>
        <LinksList>
            <Button to="/pick-preset-scenario">Choose preset scenario</Button>
            <Button to="/edit-phrases">Create your scenario</Button>
        </LinksList>
        <LinksList>
            <MinorLink to="/about">About the project</MinorLink>
            <MinorLink to="/contact-us">Contact us</MinorLink>
            {/*<MinorLink to="/donate">Donate for development</MinorLink>*/}
        </LinksList>
    </div>
);
