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
            <Button to="/new-scenario?from=preset">Choose preset scenario</Button>
            <Button to="/new-scenario">Create your scenario</Button>
            <Button to="/feed">See what people posted</Button>
        </LinksList>
        <LinksList>
            <MinorLink to="/about">About the project</MinorLink>
            <MinorLink to="/contact-us">Contact us</MinorLink>
            {/*<MinorLink to="/donate">Donate for development</MinorLink>*/}
        </LinksList>
    </div>
);
