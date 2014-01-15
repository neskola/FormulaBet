#!/usr/bin/perl

use strict;
use warnings;
use Data::Dumper;

use LWP::UserAgent;
use HTTP::Cookies;
use HTML::Parse;
use HTML::Element;
use Getopt::Long;
use JSON;

my $f1prefix = "http://www.formula1.com";

my $data_folder = "../data/";

my $ua = LWP::UserAgent->new();

my $cookies = HTTP::Cookies->new(
    file => "cookies.txt",
    autosave => 1,
    );

$ua->cookie_jar($cookies);

# Pretend to be Internet Explorer.
$ua->agent("Windows IE 10.0");

$ua->env_proxy;

sub versionMessage {
    print "Script version 0.9\n\n";
    print "---------------------\n";    
}

sub usage {
}

sub main 
{
    my %opts;

    my $update = '';

    GetOptions(\%opts,
	       'update|u=s' => \$update,
	       'version|v' => sub { versionMessage() },
	       'help|h' => sub { usage() });

    if ($update =~ 'calendar') {
	my $response = getPage($f1prefix . '/races/calendar.html');
	updateCircuitCalendar($response);
    } elsif ($update =~ 'drivers') {
	my $response = getPage($f1prefix . '/teams_and_drivers/drivers/');
	updateDrivers($response);
    } elsif ($update =~ 'allgp') {	
        print "Update all gp results.\n(Warning: may contain altered results. Check content)\n";
	       
	my $gp_calendar = openJSONFile($data_folder . 'calendar.json');

	for ( @{$gp_calendar} ) {	   	  
	    my $gp_id = $_->{gp_id};
	    my $gp_year = $_->{gp_year};
	    print $_->{gp_short_name}."\n";
	    my $response = getPage($f1prefix . '/results/season/'.$gp_year.'/'.$gp_id.'/');	
	    
	    my @elements = $response->look_down('class', 'raceResults');
	    if (defined($elements[0])) { 
#print Dumper($elements[0]->as_HTML());
		print "Results found.\n";
		my @links = {};
		for(@{ $response->extract_links('a', 'href')}) {

		    my($link, $element, $attr, $tag) = @$_;
		    if( $element->as_text =~'QUALIFYING') {
			my $taglink = $f1prefix.$link; 
			print "Q:".$taglink."\n";
		    }
		    if( $element->as_text =~'RACE' && $link =~'.*\d{4}/\d{3}\/\d{4}\/$') {
			my $taglink = $f1prefix.$link; 
			print "R:".$taglink."\n";
		    }
		}

		writeFile('results-'.$gp_id.'.txt', Dumper($elements[0]->as_HTML));
	    } else {
		print "No results found yet.\n";
	    }	    

	}
    } elsif ($update =~ 'latestgp') {
	print "Update latest gp results.";
    }
}

sub getPage {
    my $url = $_[0];
    my $response = $ua->get($url);

    if ($response->is_success) {
	print $url . "\n";
        print "Retrieved " . 
                      length($response->decoded_content) . 
                      " bytes of data.\n";
	HTML::Parse::parse_html($response->decoded_content);
    }
    else {
        print "Error: " . $response->status_line;	
    }
}

sub updateCircuitCalendar {
    my $calendarData = $_[0];

    my @elements = $calendarData->look_down('class', 'raceCalender'); # nice typo f1.com :)

    my @descendants = $elements[0]->descendants();

    my @circuits;

    my $row = 1;
    for (@descendants) {
	my $tagname = $_->tag;
	if ($tagname =~ 'td') {	    
	    my $tagtype = $_->attr_get_i('class');
	    my $taglink;
	    my $gp_id;

	    for(@{ $_->extract_links('a', 'href')}) {
		my($link, $element, $attr, $tag) = @$_;
		$taglink = $f1prefix.$link;
	    }

	    ($gp_id) = ($taglink =~ /^.*_{1}(\d{3})/);

	    if ($tagtype =~ 'raceLocation') {
	        my $gp_name = $_->as_text;
		my ($gp_short_name) = ($gp_name =~ /^.*\({1}(.*)\){1}/);
		my $detailpage = getPage($taglink);
		my $circuitinfobox = $detailpage->look_down('class', 'circuitInfoBox')->as_HTML;
		my $qualifyingtime = 
		    substr($detailpage->look_down('id', 'CT_Time_2_3')->attr_get_i('class'), 0, 22);
		my $racetime = 
		    substr($detailpage->look_down('id', 'CT_Time_3_1')->attr_get_i('class'), 0, 22);
		my $gp_year = substr($racetime, 0, 4);

		my $data = {
		    'gp_name' => $gp_name,
		    'gp_id' => $gp_id,
		    'gp_date' => $racetime,
		    'gp_qual_date' => $qualifyingtime,
		    'gp_year' => $gp_year,
		    'gp_number' => $row,
		    'gp_short_name' => $gp_short_name
		    #'gp_info' => $circuitinfobox		    
		};
		$row++;
#push(@circuits, "circuit" => $data);
		push(@circuits, $data);
	    }
	}
    }
    
    writeFile($data_folder . 'calendar.json', to_json(\@circuits, {utf8 => 1, pretty => 1}));
        
}

sub updateDrivers {
    my $driver_data = $_[0];

    my @elements = $driver_data->look_down('class', 'driverMugShot');

    my @divs = $elements[0]->find_by_tag_name('div');

    my @drivers;

    for (@divs) {
		my $imgtag = $_->find_by_tag_name('img');
		my $imgsrc = $f1prefix.$imgtag->attr_get_i('src');
		my $spantag = $_->find_by_tag_name('span');

		my ($driver_id) = ($imgsrc =~ /^.*_{1}(\d{1,3})/);
		my $name= $imgtag->attr_get_i('alt');
	
		if (defined $driver_id) {
			print $spantag->as_text."\n";
			print $imgsrc."\n";
			print $driver_id."\n";
			print $name."\n";
	
			my $data = {
				'd_id' => $driver_id,
				'd_name' => $name,
				'd_team' => $spantag->as_text,
				'd_imgsrc' => $imgsrc
			};
			
			push(@drivers, $data);
		}
	
	}

    writeFile($data_folder . 'drivers.json', to_json(\@drivers, {utf8 => 1, pretty => 1}));
}

sub writeFile {
    open (FILE, '>'.$_[0]);
    print FILE $_[1];
    close (FILE);
}

sub openJSONFile {
    local $/;
    open (my $fh, ,'<', $_[0]);
    my $json_text = <$fh>;
    close ($fh);
    my $json_calendar = decode_json( $json_text );

}


main();
